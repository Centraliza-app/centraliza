
package com.centraliza.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.stream.Stream;

public enum Status {
    A_FAZER("A FAZER"),
    EM_EXECUCAO("EM EXECUÇÃO"),
    CONCLUIDO("CONCLUÍDO");

    private final String value;

    Status(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Status fromString(String value) {
        if (value == null) {
            return null;
        }
        return Stream.of(Status.values())
              .filter(s -> s.value.equalsIgnoreCase(value))
              .findFirst()
              .orElseThrow(() -> new IllegalArgumentException("Status inválido: " + value));
    }
}