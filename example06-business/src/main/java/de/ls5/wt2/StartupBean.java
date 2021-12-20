package de.ls5.wt2;

import de.ls5.wt2.entity.DBNews;
import de.ls5.wt2.entity.DBSportType;
import de.ls5.wt2.entity.DBTrainingSession;
import de.ls5.wt2.entity.DBUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@Transactional
public class StartupBean implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private EntityManager entityManager;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {

        final DBSportType firstSportTypeItem = this.entityManager.find(DBSportType.class, 1L);

        // only initialize once
        if (firstSportTypeItem == null)
            this.createEntities();
    }

    private void createEntities()
    {
        String[] sportTypes = new String[]
        {
            "Yoga",
            "Fußball",
            "Handball",
            "Kraftsport",
            "Tennis",
            "Schwimmen",
        };

        String[] userNames = new String[]
        {
            "Karl",
            "Thorsten",
            "Ulrike",
            "Max",
            "Beate",
            "Brigitte"
        };

        for(int i = 0; i < sportTypes.length; i++)
        {
            DBSportType sportType = new DBSportType();

            sportType.setName(sportTypes[i]);
            sportType.setDescription("Das ist die Beschreibung von " + sportTypes[i]);
            sportType.setIndoor((i%2==1) ? true: false);
            sportType.setTeamsport((i%2==0) ? true: false);
            System.out.println("Erstellte Sportart: " + sportTypes[i]);
            this.entityManager.persist(sportType);
 


            DBUser user = new DBUser();

            user.setUserName(userNames[i]);
            user.setPassword(userNames[i]);
            user.setAdmin(false);
            this.entityManager.persist(user);
 


            DBTrainingSession session = new DBTrainingSession();

            session.setName("Einheit " + i);
            session.setDescription("Das ist die Testeinheit Einheit" + i);
            session.setAppointment(LocalDateTime.of(2020, 6+i, 20+i, 10+i, 5+i, 20+i));
            session.setDuration(500*i + 24*i + 50);
            session.setPrivat((i%2==0) ? true: false);
            session.setTypeOfSport(sportType);
            session.setCreator(user);
            List<DBUser> attendees = new ArrayList<>(Arrays.asList(user));
            session.setAttendees(attendees);
            this.entityManager.persist(session);
        }

        DBUser adminUser = new DBUser();

        adminUser.setUserName("admin");
        adminUser.setPassword("admin");
        adminUser.setAdmin(true);
        this.entityManager.persist(adminUser);
    }
}
