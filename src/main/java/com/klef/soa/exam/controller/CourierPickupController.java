package com.klef.soa.exam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.exam.dto.CourierPickupRequest;
import com.klef.soa.exam.dto.CourierPickupResponse;
import com.klef.soa.exam.service.CourierPickupService;

@RestController
@RequestMapping("/courier")
public class CourierPickupController {

	@Autowired
	private CourierPickupService service;
	
	@GetMapping("/")
	public String home() {
		return "Courier Service Project is Running.";
	}
	
	@PostMapping("/add")
	public ResponseEntity<CourierPickupResponse> addCourier(@RequestBody CourierPickupRequest req) {
		CourierPickupResponse courier = service.saveCourierPickup(req);
		
		return ResponseEntity.ok(courier);
	}
	
	@GetMapping("/displayall")
	public ResponseEntity<List<CourierPickupResponse>> displayallcourier() {
		List<CourierPickupResponse> courier = service.displayall();
		
		return ResponseEntity.ok(courier);
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<CourierPickupResponse> updateCourier(@PathVariable Long id, @RequestBody CourierPickupRequest req) {
		CourierPickupResponse courier = service.updateCourierPickup(id, req);
		
		return ResponseEntity.ok(courier);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteCourier(@PathVariable Long id) {
		String courier = service.deleteCourierPickup(id);
		
		return ResponseEntity.ok(courier);
	}
}
