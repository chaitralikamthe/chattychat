package com.eazy.chat.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.eazy.chat.model.users;
import com.eazy.chat.repos.userRepo;

@Component
public class securityLogic implements AuthenticationProvider {
	
	@Autowired
	private userRepo ur;
	
	private PasswordEncoder encoder;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String userName=authentication.getName();
		String pwd=authentication.getCredentials().toString();
		users user= ur.findByRegEmail(userName);
		
		if(user != null && user.getUserId()>0 && encoder.matches(pwd,user.getRegPassword())) {
			return new UsernamePasswordAuthenticationToken(
                    user.getRegUserName(), pwd);
		}
		else{
            throw new BadCredentialsException("Invalid credentials!");
        }

	}

	@Override
	public boolean supports(Class<?> authentication) {
		// TODO Auto-generated method stub
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}
