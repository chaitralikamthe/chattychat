package com.eazy.chat.model;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.factory.annotation.Value;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name="message")
public class message extends baseEntity{
	
	
	@GeneratedValue(strategy= GenerationType.AUTO,generator="native")
    @GenericGenerator(name = "native",strategy = "native")
	@Id
	private int id;
	private String message;
	
	@Column(name="senderName")
	private String senderName;
	@Column(name="receiverName")
	private String receiverName;

	private String statuss;
	
	@Transient
	private String history="false";
	
}
