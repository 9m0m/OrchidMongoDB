package com.example.orchidservice.repository;

import com.example.orchidservice.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    List<Account> findAll();
    Optional<Account> findById(Integer id);
    Account save(Account account);
    void deleteById(Integer id);
    Optional<Account> findByEmail(String email);
    List<Account> findByRoleRoleId(int roleId);
    
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.role WHERE a.email = :email")
    Optional<Account> findByEmailWithRole(@Param("email") String email);
}
