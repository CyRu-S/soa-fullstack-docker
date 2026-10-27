package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierPickupRequest {
	
	@NotBlank(message = "Sender name is required.")
	@Pattern(regexp = "^[A-Za-z ]+$", message = "Sender name must contain only letters and spaces.")
	@Size(max = 100, message = "Sender name must not exceed 100 characters.")
	private String senderName;
	private String pickupAddress;
	private double parcelWeightKg;
	private boolean status;
	
}
 
