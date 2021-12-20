package de.ls5.wt2.rest;

import de.ls5.wt2.conf.auth.permission.BasicUserPermission;
import de.ls5.wt2.entity.DBSportType;
import de.ls5.wt2.entity.DBTrainingSession;
import de.ls5.wt2.entity.DBTrainingSession_;
import de.ls5.wt2.entity.DBUser;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Transactional
@RestController
@RequestMapping(path = "rest/trainingssession")
public class TrainingsSessionREST {

    @Autowired
    private EntityManager entityManager;

    //funktioniert
    @GetMapping(path = "newest",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public DBTrainingSession readNewestSession() {

        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBTrainingSession> query = builder.createQuery(DBTrainingSession.class);

        final Root<DBTrainingSession> from = query.from(DBTrainingSession.class);

        return this.entityManager.createQuery(query).setMaxResults(1).getSingleResult();
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> create(@RequestBody final DBTrainingSession param) {
        if(param == null){return new ResponseEntity<>(HttpStatus.BAD_REQUEST);}
        final List<DBUser> resultUser = this.getCurrentUserObject();

        final DBTrainingSession session = new DBTrainingSession();
        session.setAppointment(param.getAppointment());
        session.setDescription(param.getDescription());
        session.setDuration(param.getDuration());
        session.setName(param.getName());
        session.setPrivat(param.isPrivat());
        session.setAttendees(resultUser);
        session.setCreator(resultUser.get(0));
        session.setTypeOfSport(param.getTypeOfSport());
        this.entityManager.persist(session);

        return new ResponseEntity<DBTrainingSession>(session, HttpStatus.CREATED);
    }

    // funktioniert
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> readAllAsJSON() {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBTrainingSession> query = builder.createQuery(DBTrainingSession.class);

        final Root<DBTrainingSession> from = query.from(DBTrainingSession.class);
        final Order order = builder.asc(from.get(DBTrainingSession_.APPOINTMENT));
        query.select(from).orderBy(order);

        //filtern nach current user, ob admin und was genau angezeigt wird.
        final Subject subject = SecurityUtils.getSubject();
        final BasicUserPermission permission = new BasicUserPermission();

        // filtert die sichtbaren TrainingSessions
        if (!subject.hasRole("admin")){
            ArrayList<DBTrainingSession> sessions = new ArrayList<>();
            for ( DBTrainingSession o : this.entityManager.createQuery(query).getResultList()) {
                if(permission.checkGetSessions(o)) {
                    sessions.add(o);
                }
            }
            return new ResponseEntity<List<DBTrainingSession>>(sessions, HttpStatus.OK);
        }

        // Falls admin ist, dann kommt die ganze Liste mit den Trainingssessions raus
        return new ResponseEntity<List<DBTrainingSession>>(this.entityManager.createQuery(query).getResultList(), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}",
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getOneJSONById(@PathVariable("id") final long id)
    {
        Subject subject = SecurityUtils.getSubject();
        DBTrainingSession getOne = this.entityManager.find(DBTrainingSession.class, id);
        if(getOne == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }else{
            if (subject.hasRole("admin")){
                return new ResponseEntity<DBTrainingSession>( getOne, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(path = "{id}/attendees",
                 consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> subscribeToTrainingsSession(@PathVariable("id") final Long id){

        DBTrainingSession sessionToSubscribe = this.entityManager.find(DBTrainingSession.class, id);

        List<DBUser> updatedAttendees = sessionToSubscribe.getAttendees();
        updatedAttendees.add(this.getCurrentUserObject().get(0));
        sessionToSubscribe.setAttendees(updatedAttendees);
        this.entityManager.merge(sessionToSubscribe);

        return this.readAllAsJSON();
    }

    // funktioniert
    @GetMapping(path ="/{id}/attendees", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DBUser>> getAllAttendees(@PathVariable("id") final Long id){
        return new ResponseEntity<List<DBUser>>(this.entityManager.find(DBTrainingSession.class, id).getAttendees(), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}/attendees",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> unsubscribeToTrainingsSession(@PathVariable("id") final Long id){

        DBTrainingSession sessionToSubscribe = this.entityManager.find(DBTrainingSession.class, id);

        List<DBUser> updatedAttendees = sessionToSubscribe.getAttendees();
        updatedAttendees.remove(this.getCurrentUserObject().get(0));
        sessionToSubscribe.setAttendees(updatedAttendees);
        this.entityManager.merge(sessionToSubscribe);

        return this.readAllAsJSON();
    }

    @PutMapping(path = "/{id}",
                consumes = MediaType.APPLICATION_JSON_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> editSession(@PathVariable("id") final Long id, @RequestBody final DBTrainingSession param){

        final Subject subject = SecurityUtils.getSubject();
        final BasicUserPermission permission = new BasicUserPermission();

        DBTrainingSession sessionToEdit = this.entityManager.find(DBTrainingSession.class, id);

        if (subject.hasRole("admin") || permission.checkEditSession(sessionToEdit))
        {
            param.setAttendees(sessionToEdit.getAttendees());
            param.setCreator(sessionToEdit.getCreator());

            sessionToEdit.setPrivat(param.isPrivat());
            sessionToEdit.setTypeOfSport(param.getTypeOfSport());
            sessionToEdit.setName(param.getName());
            sessionToEdit.setDuration(param.getDuration());
            sessionToEdit.setDescription(param.getDescription());
            sessionToEdit.setAppointment(param.getAppointment());
            this.entityManager.merge(sessionToEdit);
        }
        return new ResponseEntity<DBTrainingSession>(sessionToEdit, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}",
                    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteSession(@PathVariable("id") final Long id){
        final Subject subject = SecurityUtils.getSubject();
        final BasicUserPermission permission = new BasicUserPermission();

        DBTrainingSession sessionToDelete = this.entityManager.find(DBTrainingSession.class, id);
        if(sessionToDelete==null){return new ResponseEntity<>(HttpStatus.NOT_FOUND);}
        if (subject.hasRole("admin") || permission.checkDeleteSession(sessionToDelete))
        {
            this.entityManager.remove(sessionToDelete);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return this.readAllAsJSON();
    }

    private List<DBUser> getCurrentUserObject()
    {
        final Subject subject = SecurityUtils.getSubject();
        String username = (String)subject.getPrincipal();

        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUser> userQuery = builder.createQuery(DBUser.class);
        final Root<DBUser> fromUser = userQuery.from(DBUser.class);
        final Predicate userPredicate = builder.equal(fromUser.get("userName"), username);
        userQuery.select(fromUser).where(userPredicate);
        return this.entityManager.createQuery(userQuery).getResultList();
    }
}
