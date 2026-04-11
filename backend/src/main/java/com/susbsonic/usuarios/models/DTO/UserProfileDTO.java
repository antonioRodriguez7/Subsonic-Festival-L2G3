package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class UserProfileDTO {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String email;
    private String personalLink;
    private Date birthday;
    private String bio;
    private String password;
    private String currentPassword;

    public UserProfileDTO(String username, String name, String surname, String email, String personalLink, Date birthday, String bio) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.personalLink = personalLink;
        this.birthday = birthday;
        this.bio = bio;
    }
}
