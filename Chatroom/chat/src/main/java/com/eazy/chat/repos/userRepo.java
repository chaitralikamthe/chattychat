package com.eazy.chat.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eazy.chat.model.users;

@Repository
public interface userRepo extends JpaRepository<users,Integer>{
	users findByRegEmail(String email);
	users findByRegUserName(String userName);
}
