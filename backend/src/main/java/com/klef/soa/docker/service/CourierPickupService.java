package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.CourierPickupRequest;
import com.klef.soa.docker.dto.CourierPickupResponse;

public interface CourierPickupService {
	List<CourierPickupResponse> displayall();
	
	CourierPickupResponse saveCourierPickup(CourierPickupRequest req);
	
	String deleteCourierPickup(Long id);

	CourierPickupResponse updateCourierPickup(Long id, CourierPickupRequest req);
}
