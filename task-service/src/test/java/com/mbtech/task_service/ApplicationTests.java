package com.mbtech.task_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class ApplicationTests {

	@Test
	void contextLoads() {
	}

    @Test
    void mainMethodRuns() {
        Application.main(new String[]{});
    }

}
