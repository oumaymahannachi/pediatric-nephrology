package tn.pedialink.prescription.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.pedialink.prescription.dto.UserDto;

/**
 * Feign client pour communiquer avec auth-service
 * Le nom "auth-service" correspond au spring.application.name dans auth-service
 */
@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    @GetMapping("/api/users/{userId}")
    UserDto getUserById(@PathVariable("userId") String userId);
}
