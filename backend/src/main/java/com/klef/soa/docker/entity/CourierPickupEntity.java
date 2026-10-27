package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courier_table")
public class CourierPickupEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "c_id", nullable = false)
	private Long id;
	
	@Column(name = "c_name", nullable = false)
	private String senderName;
	
	@Column(name = "c_address", nullable = false)
	private String pickupAddress;
	
	@Column(name = "c_weight", nullable = false)
	private double parcelWeightKg;
	
	@Column(name = "c_status", nullable = false)
	private boolean status;
	
}
