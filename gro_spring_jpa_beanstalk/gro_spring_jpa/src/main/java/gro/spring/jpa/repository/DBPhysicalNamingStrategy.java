package gro.spring.jpa.repository;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DBPhysicalNamingStrategy extends PhysicalNamingStrategyStandardImpl{

    private static Logger logger = LoggerFactory.getLogger(DBPhysicalNamingStrategy.class);

    @Override
    public Identifier toPhysicalCatalogName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        return super.toPhysicalCatalogName(toSnakeCase(identifier), jdbcEnv);
    }

    @Override
    public Identifier toPhysicalColumnName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        Identifier newIdentifier = super.toPhysicalColumnName(toSnakeCase(identifier), jdbcEnv);
        logger.trace("Converted java attribute name {} to database column name {}", identifier.getText(), newIdentifier.getText());
        return newIdentifier;
    }

    @Override
    public Identifier toPhysicalSchemaName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        return super.toPhysicalSchemaName(toSnakeCase(identifier), jdbcEnv);
    }

    @Override
    public Identifier toPhysicalSequenceName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        return super.toPhysicalSequenceName(toSnakeCase(identifier), jdbcEnv);
    }

    @Override
    public Identifier toPhysicalTableName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        Identifier newIdentifier = super.toPhysicalTableName(Identifier.toIdentifier(
                                        String.format("t_%s", toSnakeCase(identifier).getText())), jdbcEnv);
        logger.trace("Converted java class name {} to database table name {}", identifier.getText(), newIdentifier.getText());
        return newIdentifier;
    }

    private Identifier convertToSnakeCase(final Identifier identifier) {
        System.out.println("Identifier received is "+identifier.getText());
        final String regex = "([a-z])([A-Z])";
        final String replacement = "$1_$2";
        final String newName = identifier.getText()
        .replaceAll(regex, replacement)
        .toLowerCase();
        return Identifier.toIdentifier(newName);
    }

    private Identifier toSnakeCase(Identifier id) {
        if (id == null)return id;
        String name = id.getText();
        String snakeName = name.replaceAll("([a-z]+)([A-Z]+)", "$1\\_$2").toLowerCase();
        if (!snakeName.equals(name))
            return new Identifier(snakeName, id.isQuoted());
        else
            return id;
    }

    public static void main(String[] args) {
        String name = "t_customer";
        String snakeName = name.replaceAll("([a-z]+)([A-Z]+)", "$1\\_$2").toLowerCase();
        System.out.println(snakeName);

    }


}
