package com.example.orchidservice.service;

import com.example.orchidservice.service.imp.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.orchidservice.pojo.Role;
import com.example.orchidservice.repository.RoleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService implements IRoleService {

    @Autowired
    private RoleRepository roleRepository;
}