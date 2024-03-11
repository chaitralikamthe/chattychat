package com.eazy.chat.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eazy.chat.model.message;
import com.eazy.chat.model.users;
import com.eazy.chat.repos.messageRepo;
import com.eazy.chat.repos.userRepo;

@Service
public class userService implements UserDetailsService {
	
	@Autowired
	private userRepo repo;
	

	userService(userRepo repo){
		this.repo=repo;
	}
	

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		users user = repo.findByRegEmail(username); 
        System.out.println(user); 
         
        if(user==null) { 
            throw new UsernameNotFoundException("User not found with this email"+username); 
  
        } 
  
          
        System.out.println("Loaded user: " + user.getRegEmail()); 
        List<GrantedAuthority> authorities = new ArrayList<>(); 
        return new org.springframework.security.core.userdetails.User( 
                user.getRegEmail(), 
                user.getRegPassword(),
                authorities); 
    } 
}
