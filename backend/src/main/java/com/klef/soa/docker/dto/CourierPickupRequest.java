package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierPickupRequest {
	
	private String senderName;
	private String pickupAddress;
	private double parcelWeightKg;
	private boolean status;
	
}
 