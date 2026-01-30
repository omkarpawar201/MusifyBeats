package com.musifybeats.auth.dto;

public class AuthResponse {
	private String token;
	private Long id;
	private String displayName;
	private String email;
	private String role;

	public AuthResponse(String token) {
		this.token = token;
	}

	public AuthResponse(String token, Long id, String displayName, String email, String role) {
		this.token = token;
		this.id = id;
		this.displayName = displayName;
		this.email = email;
		this.role = role;
	}

	public String getToken() {
		return token;
	}

	public Long getId() {
		return id;
	}

	public String getDisplayName() {
		return displayName;
	}

	public String getEmail() {
		return email;
	}

	public String getRole() {
		return role;
	}
}
