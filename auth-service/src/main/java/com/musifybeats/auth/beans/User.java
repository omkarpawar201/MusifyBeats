package com.musifybeats.auth.beans;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "email", unique = true, nullable = false)
	private String email;

	@Column(name = "password", nullable = false)
	@com.fasterxml.jackson.annotation.JsonIgnore
	private String password;

	@Column(name = "role", nullable = false)
	private String role;

	@Column(name = "display_name", nullable = false)
	private String displayName;

	@Column(name = "created_at")
	private java.time.LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		createdAt = java.time.LocalDateTime.now();
	}

	// getters & setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
}
