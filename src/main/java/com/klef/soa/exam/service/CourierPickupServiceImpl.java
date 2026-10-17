package com.klef.soa.exam.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.exam.dto.CourierPickupRequest;
import com.klef.soa.exam.dto.CourierPickupResponse;
import com.klef.soa.exam.entity.CourierPickupEntity;
import com.klef.soa.exam.repository.CourierPickupRepository;

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
	public CourierPickupResponse updateCourierPickup(Long id, CourierPickupRequest req) {
		CourierPickupEntity exists = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found."));
		
		CourierPickupEntity courier = CourierPickupEntity.builder()
				.id(exists.getId())
				.senderName(req.getSenderName())
				.parcelWeightKg(req.getParcelWeightKg())
				.pickupAddress(req.getPickupAddress())
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
			return "User Not Found.";
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
}
