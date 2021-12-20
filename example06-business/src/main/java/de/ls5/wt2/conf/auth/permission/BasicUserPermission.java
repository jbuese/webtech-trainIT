package de.ls5.wt2.conf.auth.permission;

import java.util.ArrayList;
import java.util.List;

import de.ls5.wt2.entity.DBTrainingSession;
import de.ls5.wt2.entity.DBUser;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.Permission;

public class BasicUserPermission implements Permission {


  public BasicUserPermission() {
  }


  @Override
  public boolean implies(Permission p) {
    return false;
  }

  // Es sollten nur die öffentlichen Eineheiten und falls privat die selbst erstellten Einheiten
  // zurückgegeben weden (Admin-Rolle sollte schon vorher getestet werden)
  public boolean checkGetSessions(DBTrainingSession session) {
    String currentUser = (String)SecurityUtils.getSubject().getPrincipals().getPrimaryPrincipal();

      // Es dürfen keine privaten Einheiten weitergegeben werden, die nicht vom akt. User erstellt wurden
      if(session.isPrivat() && !currentUser.equals(session.getCreator().getUserName())) {
        return false;
      }

    return true;
  }

  // Einheiten dürfen jederzeit erstellt werden
  public boolean checkCreateSessions() {
    return true;
  }

  // Einheiten dürfen nur bearbeitet werden vom Ersteller (Admin-Rolle sollte vorher geprüft werden!)
  public boolean checkEditSession(DBTrainingSession session) {
    String currentUser = (String) SecurityUtils.getSubject().getPrincipals().getPrimaryPrincipal();

    // Wenn der aktuelle User der Ersteller der Einheit ist, darf er die Einheit auch bearbeiten
    if(currentUser.equals(session.getCreator().getUserName())) {
      return true;
    }

    return false;
  }

  public boolean checkDeleteSession(DBTrainingSession session) {
    String currentUser = (String) SecurityUtils.getSubject().getPrincipals().getPrimaryPrincipal();

    if (currentUser.equals(session.getCreator().getUserName())) {
      return true;
    }

    return false;
  }
}
