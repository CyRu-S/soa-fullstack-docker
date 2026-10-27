package com.klef.soa.docker.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.klef.soa.docker.dto.CourierPickupRequest;
import com.klef.soa.docker.dto.CourierPickupResponse;
import com.klef.soa.docker.entity.CourierPickupEntity;
import com.klef.soa.docker.repository.CourierPickupRepository;
import com.klef.soa.docker.service.CourierPickupService;

@Service
public class CourierPickupServiceImpl implements CourierPickupService{

	@Autowired
	private CourierPickupRepository repo;

	@Override
	public List<CourierPickupResponse> displayall() {
		return repo.findAll()
				.stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public CourierPickupResponse saveCourierPickup(CourierPickupRequest req) {
		CourierPickupEntity courier = CourierPickupEntity.builder()
				.senderName(req.getSenderName())
				.pickupAddress(req.getPickupAddress())
				.parcelWeightKg(req.getParcelWeightKg())
				.status(req.isStatus())
				.build();
		
		CourierPickupEntity saved = repo.save(courier);
		
		return mapToResponse(saved);
	}


	@Override
	public String deleteCourierPickup(Long id) {
		if (repo.existsById(id)) {
			repo.deleteById(id);
			return "User Deleted.";
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier pickup with ID " + id + " not found.");
		}
	}
	
	private CourierPickupResponse mapToResponse(CourierPickupEntity courier) {
		return CourierPickupResponse.builder()
				.id(courier.getId())
				.senderName(courier.getSenderName())
				.pickupAddress(courier.getPickupAddress())
				.parcelWeightKg(courier.getParcelWeightKg())
				.status(courier.isStatus())
				.build();
	}

	@Override
	public CourierPickupResponse updateCourierPickup(Long id, CourierPickupRequest req) {
		CourierPickupEntity existing = repo.findById(id).orElseThrow(() ->
				new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier pickup with ID " + id + " not found."));

		CourierPickupEntity data = CourierPickupEntity.builder()
									.id(existing.getId())
									.parcelWeightKg(req.getParcelWeightKg())
									.pickupAddress(req.getPickupAddress())
									.senderName(req.getSenderName())
									.status(req.isStatus())
									.build();
		
		CourierPickupEntity saved = repo.save(data);

		return mapToResponse(saved);
	}
}
