package com.sistema.taller.utils;

import com.sistema.taller.model.TipoRol;
import org.springframework.security.core.GrantedAuthority;

public class Authority implements GrantedAuthority {

    private TipoRol authority;

    public Authority(TipoRol authority) {
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return "ROLE_" + authority.name();
    }

}
