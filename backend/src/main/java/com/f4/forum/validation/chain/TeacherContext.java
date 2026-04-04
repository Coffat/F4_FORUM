package com.f4.forum.validation.chain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherContext {
    private String token;
    private Long teacherId;
    private Long classId;
    private Object command;
    private String moduleName;

    public TeacherContext(String token, Long classId, Object command, String moduleName) {
        this.token = token;
        this.classId = classId;
        this.command = command;
        this.moduleName = moduleName;
    }
}
