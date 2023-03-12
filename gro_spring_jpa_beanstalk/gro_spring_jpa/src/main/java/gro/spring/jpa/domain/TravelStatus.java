package gro.spring.jpa.domain;

public enum TravelStatus {
    SCHEDULED("Scheduled"),
    OPEN("Open"),
    DEPARTED("Departed"),
    CANCELLED("Cancelled")
    ;

    private String dbName;
    private TravelStatus(String dbName){
        this.dbName = dbName;
    }

    public String getDbName() {
        return dbName;
    }

    public static TravelStatus fromDBName(String name){
        switch (name){
            case "Scheduled":
                return TravelStatus.SCHEDULED;
            case "Open":
                return TravelStatus.OPEN;
            case "Departed":
                return TravelStatus.DEPARTED;
            case "Cancelled":
                return TravelStatus.CANCELLED;
            default:
                throw new IllegalArgumentException(String.format("DB Name: %s not supported", name));
        }
    }

}
