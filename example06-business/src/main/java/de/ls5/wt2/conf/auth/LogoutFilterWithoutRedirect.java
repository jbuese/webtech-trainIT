package de.ls5.wt2.conf.auth;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.LogoutFilter;

public class LogoutFilterWithoutRedirect extends LogoutFilter {

    @Override
    protected void issueRedirect(ServletRequest request, ServletResponse response, String redirectUrl) {
        // System.out.println("heja");
        // System.out.println("logged out?");
        // // System.out.println(subj.getSession());
        // // System.out.println(subj.getPrincipal());
        SecurityUtils.getSubject().logout();
        // do not redirect
    }
}
