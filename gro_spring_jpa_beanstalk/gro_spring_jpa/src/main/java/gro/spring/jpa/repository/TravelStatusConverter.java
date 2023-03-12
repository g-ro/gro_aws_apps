package gro.spring.jpa.repository;

import gro.spring.jpa.domain.TravelStatus;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TravelStatusConverter implements AttributeConverter<TravelStatus, String> {

    @Override
    public String convertToDatabaseColumn(TravelStatus attribute) {
        return attribute.getDbName();
    }

    @Override
    public TravelStatus convertToEntityAttribute(String dbData) {
        return TravelStatus.fromDBName(dbData);
    }
}
