package de.ls5.wt2.conf.auth;

import java.util.Collection;
import java.util.Collections;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import de.ls5.wt2.conf.auth.permission.BasicUserPermission;
import de.ls5.wt2.entity.DBUser;
import de.ls5.wt2.entity.DBUser_;

public class WT2Realm extends AuthorizingRealm implements Realm {

    final static String REALM = "WT2";

    @Autowired
    private EntityManager entityManager;

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        System.out.println("Starting auth for: "+token.getPrincipal());
        final String userName = (String) token.getPrincipal();
        final String userPassword = new String((char[]) token.getCredentials());
        System.out.println("trying auth for: "+userName+", "+userPassword);

        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUser> query = builder.createQuery(DBUser.class);
        final Root<DBUser> from = query.from(DBUser.class);

        query.select(from);
        query.where(builder.equal(from.get(DBUser_.USER_NAME), userName));

        final DBUser result = this.entityManager.createQuery(query).getSingleResult();

        if(result.getPassword().equals(userPassword)) {
            System.out.println("login succesful");
            return new SimpleAuthenticationInfo(userName, userPassword, WT2Realm.REALM);
        } else {
            throw new AuthenticationException();
        }
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        return new AuthorizationInfo() {

            @Override
            public Collection<String> getRoles() {
                if ("admin".equals(principals.getPrimaryPrincipal())) {
                    return Collections.singleton("admin");
                }

                return Collections.emptyList();
            }

            @Override
            public Collection<String> getStringPermissions() {
                return Collections.emptyList();
            }

            @Override
            public Collection<Permission> getObjectPermissions() {
                return Collections.singleton(new BasicUserPermission());
            }
        };
    }
}
