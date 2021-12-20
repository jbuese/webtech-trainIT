package de.ls5.wt2.auth;

import java.util.Base64;
import java.util.List;
import java.util.Base64.Decoder;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import de.ls5.wt2.entity.DBUser;
import de.ls5.wt2.entity.DBUser_;

@Transactional
@RestController
@RequestMapping(path = {"rest/auth/", "rest/auth/basic/profile", "rest/auth/jwt/profile"})
public class UserREST {
    @Autowired
    private EntityManager entityManager;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE,
                 path = "users")
    public ResponseEntity<?> createProfile(@RequestBody final DBUser param) {
        if(param==null){return new ResponseEntity<>(HttpStatus.BAD_REQUEST);}
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUser> query = builder.createQuery(DBUser.class);
        final Root<DBUser> from = query.from(DBUser.class);

        query.select(from);
        query.where(builder.equal(from.get(DBUser_.USER_NAME), param.getUserName()));
        final List<DBUser> foundUsers = this.entityManager.createQuery(query).getResultList();

        if(foundUsers.size() > 0)
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        else
        {
            final DBUser user = new DBUser();

            Decoder decoder = Base64.getDecoder();
            byte[] passwordDecodedByte = decoder.decode(param.getPassword());
            String passwordDecoded = new String(passwordDecodedByte);

            user.setUserName(param.getUserName());
            user.setPassword(passwordDecoded);
            user.setAdmin(false);

            this.entityManager.persist(user);

            return new ResponseEntity<DBUser>(user, HttpStatus.CREATED);
        }
    }

    @GetMapping(path="users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> readAllUsersAsJSON(){
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUser> query = builder.createQuery(DBUser.class);

        final Root<DBUser> from = query.from(DBUser.class);
        final Order order = builder.asc(from.get(DBUser_.USER_NAME));

        query.select(from).orderBy(order);

        return new ResponseEntity<List<DBUser>>(this.entityManager.createQuery(query).getResultList(), HttpStatus.OK);
    }

    //TODO Relationen müssen alle gelöscht werden, bevor der User gelöscht werden kann.
    // TrainingsSessions des Users, Subscriptions des Users müssen aufgelöst werden
    @DeleteMapping(path = "users/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteUser(@PathVariable("id") final Long id){
        Subject subject = SecurityUtils.getSubject();
        DBUser userToDelete = this.entityManager.find(DBUser.class, id);
        if(userToDelete==null){return new ResponseEntity<>(HttpStatus.NOT_FOUND);}

        if (subject.hasRole("admin"))
        {
            this.entityManager.remove(userToDelete);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return this.readAllUsersAsJSON();
    }

    @GetMapping(path="users/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> readUserAsJSON(@PathVariable("username") final String username){
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUser> query = builder.createQuery(DBUser.class);

        final Root<DBUser> from = query.from(DBUser.class);

        query.select(from);
        ParameterExpression<String> parameter = builder.parameter(String.class);
        query.where(builder.equal(from.get(DBUser_.USER_NAME), parameter));


        return new ResponseEntity<DBUser>(this.entityManager.createQuery(query).setParameter(parameter, username).setMaxResults(1).getSingleResult(), HttpStatus.OK);
    }



    @GetMapping(path = "admin/{username}", 
                produces = MediaType.APPLICATION_JSON_VALUE)
    public Boolean readAsJSON(@PathVariable("username") final String username) {
        System.out.println("request isAdmin for: "+username);

        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUser> query = builder.createQuery(DBUser.class);
        final Root<DBUser> from = query.from(DBUser.class);

        query.select(from);
        query.where(builder.equal(from.get(DBUser_.USER_NAME), username));

        final DBUser requestedUser = this.entityManager.createQuery(query).getSingleResult();

        return requestedUser.getAdmin();
    }
}
