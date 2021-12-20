package de.ls5.wt2.entity;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.*;

@Entity
public class DBTrainingSession {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    @ManyToOne
    private DBSportType typeOfSport;
    private int duration;
    private LocalDateTime appointment;
    private String description;
    @ManyToOne
    private DBUser creator;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<DBUser> attendees;
    private boolean privat;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public LocalDateTime getAppointment() {
        return appointment;
    }

    public void setAppointment(LocalDateTime appointment) {
        this.appointment = appointment;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPrivat() {
        return privat;
    }

    public void setPrivat(boolean privat) {
        this.privat = privat;
    }

    public DBUser getCreator() {
        return creator;
    }

    public void setCreator(DBUser creator) {
        this.creator = creator;
    }

    public DBSportType getTypeOfSport() {
        return typeOfSport;
    }
    public void setTypeOfSport( DBSportType typeOfSport) {
        this.typeOfSport = typeOfSport;
    }

    public List<DBUser> getAttendees() {
        return attendees;
    }

    public void setAttendees(List<DBUser> attendees) {
        this.attendees = attendees;
    }

    public long getId() {
        return id;
    }
}
