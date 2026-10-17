package com.klef.soa.exam.service;

import java.util.List;

import com.klef.soa.exam.dto.CourierPickupRequest;
import com.klef.soa.exam.dto.CourierPickupResponse;

public interface CourierPickupService {
	List<CourierPickupResponse> displayall();
	
	CourierPickupResponse saveCourierPickup(CourierPickupRequest req);
	
	String deleteCourierPickup(Long id);
}
