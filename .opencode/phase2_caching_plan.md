# Phase 2: Caching Proxy (Redis)

## Mục tiêu
Tăng hiệu năng cho các API get dữ liệu nhiều (courses, classes, rooms, schedules) bằng Redis caching.

## Triển khai theo BE_SKILLS.md #6
> "Proxy: Dùng Spring AOP cho các tác vụ xuyên suốt (Logging, Caching, Transaction, Security)."

---

## Task 2.1: Thêm Redis dependencies

### 2.1.1 Cập nhật pom.xml
**File:** `backend/pom.xml`

**Thêm sau `spring-boot-starter-validation`:**

```xml
<!-- Redis for Caching -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

---

## Task 2.2: Tạo Redis Cache Configuration

### 2.2.1 Tạo RedisCacheConfig
**File:** `backend/src/main/java/com/f4/forum/config/RedisCacheConfig.java`

```java
package com.f4.forum.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
@ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis", matchIfMissing = true)
public class RedisCacheConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        return new LettuceConnectionFactory(config);
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Courses - 5 phút
        cacheConfigurations.put("courses", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Classes - 5 phút
        cacheConfigurations.put("classes", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Rooms - 15 phút (ít thay đổi)
        cacheConfigurations.put("rooms", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Schedules - 5 phút
        cacheConfigurations.put("schedules", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Promotions - 5 phút
        cacheConfigurations.put("promotions", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Users - 10 phút
        cacheConfigurations.put("users", defaultConfig.entryTtl(Duration.ofMinutes(10)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }
}
```

---

## Task 2.3: Thêm @Cacheable vào CourseQueryService

### 2.3.1 Cập nhật CourseQueryService
**File:** `backend/src/main/java/com/f4/forum/service/CourseQueryService.java`

**Thêm imports:**
```java
import org.springframework.cache.annotation.Cacheable;
import com.f4.forum.dto.response.CourseCatalogResponse;
```

**Thêm annotations @Cacheable:**

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class CourseQueryService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    @Cacheable(value = "courses", key = "#id", unless = "#result == null")
    public CourseResponse getCourseById(Long id) {
        log.debug("Fetching course from DB: {}", id);
        return courseRepository.findById(id)
                .map(courseMapper::toResponse)
                .orElse(null);
    }

    @Cacheable(value = "courses", key = "'status:' + #status", unless = "#result.isEmpty()")
    public List<CourseResponse> getCoursesByStatus(CourseStatus status) {
        log.debug("Fetching courses by status from DB: {}", status);
        return courseRepository.findByStatus(status).stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "courses", key = "'all'", unless = "#result.isEmpty()")
    public List<CourseResponse> getAllCourses() {
        log.debug("Fetching all courses from DB");
        return courseRepository.findAll().stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "courses", key = "'catalog:' + #category", unless = "#result.isEmpty()")
    public List<CourseCatalogResponse> getCourseCatalog(String category) {
        return courseRepository.findByCategory(category).stream()
                .map(courseMapper::toCatalogResponse)
                .collect(Collectors.toList());
    }
}
```

---

## Task 2.4: Thêm @Cacheable vào các Service khác

### 2.4.1 Cập nhật StaffClassFacade
**File:** `backend/src/main/java/com/f4/forum/facade/StaffClassFacade.java`

**Thêm import:**
```java
import org.springframework.cache.annotation.Cacheable;
```

**Thêm annotation:**
```java
@Cacheable(value = "classes", key = "#id", unless = "#result == null")
public ClassResponse getClassById(Long id) {
    return classRepository.findById(id)
            .map(classMapper::toResponse)
            .orElse(null);
}

@Cacheable(value = "classes", key = "'all'", unless = "#result.isEmpty()")
public List<ClassResponse> getAllClasses() {
    return classRepository.findAll().stream()
            .map(classMapper::toResponse)
            .collect(Collectors.toList());
}
```

### 2.4.2 Cập nhật StaffRoomFacade (tạo nếu chưa có)
**Thêm annotation:**
```java
@Cacheable(value = "rooms", key = "#id", unless = "#result == null")
public RoomResponse getRoomById(Long id) {
    return roomRepository.findById(id)
            .map(mapper::toResponse)
            .orElse(null);
}

@Cacheable(value = "rooms", key = "'all'", unless = "#result.isEmpty()")
public List<RoomResponse> getAllRooms() {
    return roomRepository.findAll().stream()
            .map(mapper::toResponse)
            .collect(Collectors.toList());
}
```

### 2.4.3 Cập nhật ScheduleService
**File:** `backend/src/main/java/com/f4/forum/service/ScheduleService.java`

```java
@Cacheable(value = "schedules", key = "'class:' + #classId", unless = "#result.isEmpty()")
public List<ScheduleResponse> getSchedulesByClassId(Long classId) {
    return scheduleRepository.findByClassEntityId(classId).stream()
            .map(mapper::toResponse)
            .collect(Collectors.toList());
}
```

---

## Task 2.5: Tạo Cache Eviction

### 2.5.1 Tạo CacheEvictor service
**File:** `backend/src/main/java/com/f4/forum/service/CacheEvictorService.java`

```java
package com.f4.forum.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheEvictorService {

    private final CacheManager cacheManager;

    @Async
    public void evictCourseCache() {
        evictCache("courses");
    }

    @Async
    public void evictClassCache() {
        evictCache("classes");
    }

    @Async
    public void evictRoomCache() {
        evictCache("rooms");
    }

    @Async
    public void evictScheduleCache() {
        evictCache("schedules");
    }

    @Async
    public void evictPromotionCache() {
        evictCache("promotions");
    }

    @Async
    public void evictAllCaches() {
        cacheManager.getCacheNames().forEach(this::evictCache);
    }

    private void evictCache(String cacheName) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            log.info("🗑️ [CACHE] Evicted cache: {}", cacheName);
        }
    }
}
```

### 2.5.2 Thêm vào CourseCommandService
**File:** `backend/src/main/java/com/f4/forum/service/CourseCommandService.java`

**Thêm dependency và evict sau khi create/update/delete:**
```java
private final CacheEvictorService cacheEvictorService;

// Trong method create/update/delete
cacheEvictorService.evictCourseCache();
```

---

## Task 2.6: Cấu hình application.properties

### 2.6.1 Cập nhật application.properties
**File:** `backend/src/main/resources/application.properties`

**Thêm:**
```properties
# Redis Configuration
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.data.redis.database=0

# Cache Configuration
spring.cache.type=redis
spring.cache.redis.time-to-live=600000
spring.cache.redis.cache-null-values=false
spring.cache.cache-names=courses,classes,rooms,schedules,promotions,users
```

---

## Tổng kết Phase 2

### Files tạo mới (2 files)
```
backend/src/main/java/com/f4/forum/config/RedisCacheConfig.java
backend/src/main/java/com/f4/forum/service/CacheEvictorService.java
```

### Files sửa đổi (5 files)
```
backend/pom.xml
backend/src/main/java/com/f4/forum/service/CourseQueryService.java
backend/src/main/java/com/f4/forum/facade/StaffClassFacade.java
backend/src/main/java/com/f4/forum/service/ScheduleService.java
backend/src/main/resources/application.properties
```

### Dependencies thêm mới
- `spring-boot-starter-data-redis`
- `spring-boot-starter-cache`

### Yêu cầu hệ thống
- Redis server chạy trên localhost:6379 (hoặc cấu hình trong application.properties)

### Kiểm tra sau khi triển khai
1. Gọi API course nhiều lần → kiểm tra chỉ 1 lần query DB (log "Fetching course from DB")
2. Kiểm tra Redis keys: `courses::*`
3. Update course → kiểm tra cache được clear

---

## Mapping với BE_SKILLS.md

| Tiêu chuẩn BE_SKILLS.md | Triển khai |
|-------------------------|------------|
| #6: Proxy (Caching) | @Cacheable + Redis |
| #6: Spring AOP | CacheManager + CacheEvictor |
| #5: Facade | StaffClassFacade |

---

## Next Step
**Phase 3: State Pattern** → Tiếp theo sau khi hoàn thành Phase 2
