package de.ls5.wt2.rest;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;

import de.ls5.wt2.entity.DBSportType;
import de.ls5.wt2.entity.DBSportType_;
import de.ls5.wt2.entity.DBUser;
import de.ls5.wt2.entity.DBUser_;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Transactional
@RestController
@RequestMapping(path = "rest/sporttypes")
public class SportTypeREST {
    @Autowired
    private EntityManager entityManager;

    @GetMapping(path = "newest",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public DBSportType readNewestSport() {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBSportType> query = builder.createQuery(DBSportType.class);

        final Root<DBSportType> from = query.from(DBSportType.class);


        return this.entityManager.createQuery(query).setMaxResults(1).getSingleResult();
    }

    //TODO Relationen zu TrainingsSessions müssten eigt noch aufgelöst werden, damit es korrekt gelöscht wird
    @DeleteMapping( path="/{id}",
                    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteSporttype(@PathVariable("id") final Long id){
        Subject subject =SecurityUtils.getSubject();
        DBSportType sporttypeToDelete = this.entityManager.find(DBSportType.class, id);
        if(sporttypeToDelete==null){return new ResponseEntity<>(HttpStatus.NOT_FOUND);}
        if (subject.hasRole("admin")) {
            this.entityManager.remove(sporttypeToDelete);
        }else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return this.readAllAsJSON();
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> create(@RequestBody final DBSportType param) {
        if(param==null){return new ResponseEntity<>(HttpStatus.BAD_REQUEST);}
        final Subject subject = SecurityUtils.getSubject();
        if (!subject.hasRole("admin"))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBSportType> query = builder.createQuery(DBSportType.class);
        final Root<DBSportType> from = query.from(DBSportType.class);

        query.select(from);
        query.where(builder.equal(from.get(DBSportType_.NAME), param.getName()));
        final List<DBSportType> foundSporTypes = this.entityManager.createQuery(query).getResultList();

        if(foundSporTypes.size() > 0)
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        else
        {
            final DBSportType sport = new DBSportType();

            sport.setName(param.getName());
            sport.setDescription(param.getDescription());
            sport.setIndoor(param.isIndoor());
            sport.setTeamsport(param.isTeamsport());

            this.entityManager.persist(sport);

            return new ResponseEntity<DBSportType>(sport, HttpStatus.CREATED);
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> readAllAsJSON() {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBSportType> query = builder.createQuery(DBSportType.class);

        final Root<DBSportType> from = query.from(DBSportType.class);
        final Order order = builder.asc(from.get(DBSportType_.NAME));

        query.select(from).orderBy(order);

        return new ResponseEntity<List<DBSportType>>(this.entityManager.createQuery(query).getResultList(), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> readAsJSON(@PathVariable("id") final long id) {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBSportType> query = builder.createQuery(DBSportType.class);

        final Root<DBSportType> from = query.from(DBSportType.class);

        query.select(from);
        ParameterExpression<Long> parameter = builder.parameter(Long.class);
        query.where(builder.equal(from.get(DBSportType_.ID), parameter));

        return new ResponseEntity<DBSportType>(this.entityManager.createQuery(query).setParameter(parameter, id).setMaxResults(1).getSingleResult(), HttpStatus.OK);
    }
}
