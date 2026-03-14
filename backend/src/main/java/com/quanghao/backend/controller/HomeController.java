package com.quanghao.backend.controller;


import com.quanghao.backend.dto.HomePageDTO;
import com.quanghao.backend.dto.ProductListDTO;
import com.quanghao.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/home")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HomeController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<HomePageDTO> getHomePage(){
        HomePageDTO homeData = productService.getHomePageData();
        return ResponseEntity.ok(homeData);
    }

    @GetMapping
    public ResponseEntity<Page<ProductListDTO>>search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size){
        Pageable pageable = PageRequest.of(page,size);
        return ResponseEntity.ok(productService.searchProducts(keyword, pageable));
    }
}
