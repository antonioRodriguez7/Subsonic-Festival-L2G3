package com.susbsonic.usuarios;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
//import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SubsonicUsuariosApplication {

	private static final Logger logger = LoggerFactory.getLogger(SubsonicUsuariosApplication.class);

	public static void main(String[] args) {
		long start = System.currentTimeMillis();
		SpringApplication.run(SubsonicUsuariosApplication.class, args);
		long end = System.currentTimeMillis();
		logger.info("Application started in {} seconds",
				(end - start) / 1000.0);
	}

}
