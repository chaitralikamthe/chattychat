package com.eazy.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eazy.chat.config.JwtProvider;
import com.eazy.chat.model.users;
import com.eazy.chat.repos.userRepo;
import com.eazy.chat.response.AuthResponse;
import com.eazy.chat.service.userService;

@RestController
@RequestMapping("/auth")
public class UserController {
	
	@Autowired
    private userRepo userRepository; 
	
    @Autowired
    private PasswordEncoder passwordEncoder; 
       
    @Autowired
    private userService customUserDetails; 
       
    @CrossOrigin(origins="*")
    @PostMapping("/signup") 
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody users user)  { 
    	System.out.println("Request for sign up\n"+ user);
    	String email = user.getRegEmail(); 
        String password = user.getRegPassword(); 
        String fullName = user.getRegUserName(); 
        String mobile = user.getRegMobile(); 
        
        users isEmailExist = userRepository.findByRegEmail(email); 
        if (isEmailExist != null) { 
            //throw new Exception("Email Is Already Used With Another Account"); 
  
        } 
        users createdUser = new users(); 
        createdUser.setRegEmail(email); 
        createdUser.setRegUserName(fullName); 
        createdUser.setRegMobile(mobile); 
        createdUser.setRegPassword(passwordEncoder.encode(password)); 
        createdUser.setUserName(createdUser.getRegEmail().substring(0,createdUser.getRegEmail().indexOf("@")));
          
        users savedUser = userRepository.save(createdUser); 
          userRepository.save(savedUser); 
        Authentication authentication = new UsernamePasswordAuthenticationToken(email,password); 
        SecurityContextHolder.getContext().setAuthentication(authentication); 
        String token = JwtProvider.generateToken(authentication); 
  
  
        AuthResponse authResponse = new AuthResponse(); 
        authResponse.setJwt(token); 
        authResponse.setMessage("Register Success"); 
        authResponse.setStatus(true); 
        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK); 
  
    } 
  
    @CrossOrigin(origins="*")
    @PostMapping("/signin") 
    public ResponseEntity<AuthResponse> signin(@RequestBody users loginRequest) { 
        String username = loginRequest.getRegEmail(); 
        String password = loginRequest.getRegPassword(); 
  
        System.out.println(username+"-------"+password); 
  
        Authentication authentication = authenticate(username,password); 
        SecurityContextHolder.getContext().setAuthentication(authentication); 
  
        String token = JwtProvider.generateToken(authentication); 
        AuthResponse authResponse = new AuthResponse(); 
  
        authResponse.setMessage("Login success"); 
        authResponse.setJwt(token); 
        authResponse.setStatus(true); 
  
        return new ResponseEntity<>(authResponse,HttpStatus.OK); 
    } 
  
  
  
    @CrossOrigin(origins="*") 
    private Authentication authenticate(String username, String password) { 
  
        System.out.println(username+"---++----"+password); 
  
        UserDetails userDetails = customUserDetails.loadUserByUsername(username); 
  
        System.out.println("Sig in in user details"+ userDetails); 
  
        if(userDetails == null) { 
            System.out.println("Sign in details - null" + userDetails); 
  
            throw new BadCredentialsException("Invalid username and password"); 
        } 
        if(!passwordEncoder.matches(password,userDetails.getPassword())) { 
            System.out.println("Sign in userDetails - password mismatch"+userDetails); 
  
            throw new BadCredentialsException("Invalid password"); 
  
        } 
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities()); 
  
    } 
  
}
