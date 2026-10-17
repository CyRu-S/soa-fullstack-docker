package com.klef.soa.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierPickupResponse {
	
	private Long id;
	private String senderName;
	private String pickupAddress;
	private double parcelWeightKg;
	private boolean status;
	
}
