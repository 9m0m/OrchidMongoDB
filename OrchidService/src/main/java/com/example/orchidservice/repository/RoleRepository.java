package com.example.orchidservice.repository;

import com.example.orchidservice.pojo.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    Role findByRoleName(String roleName);
}