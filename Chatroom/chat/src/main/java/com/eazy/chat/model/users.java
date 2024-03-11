package com.eazy.chat.model;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
public class users extends baseEntity{
	
	@GeneratedValue(strategy= GenerationType.AUTO,generator="native")
    @GenericGenerator(name = "native",strategy = "native")
	@Id
	private int userId;
	
    @Size(min=3, message="Field must be at least 3 characters long")
	private String regUserName;
	
    @Size(min=8, message="Password must be at least 8 characters long")
	private String regPassword;
	
	
	@Email(message="Please enter valid email")
	private String regEmail;
	
    @Size(min=10, message="Mobile number must be 10 digits")
	private String regMobile;
    
    
    private String userName;

}
