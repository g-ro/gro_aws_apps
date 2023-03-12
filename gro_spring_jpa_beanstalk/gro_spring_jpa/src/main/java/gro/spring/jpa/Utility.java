package gro.spring.jpa;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class Utility {

    public static final DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

    public static boolean isNull(Object value) {
        return value == null;
    }

    public static String getSHA256Hash(String word) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(word.getBytes(StandardCharsets.UTF_8));
            return String.format("%064x", new BigInteger(1, hash));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static Timestamp toTimestamp(String datetime){
        try {
            Date date = (Date) formatter.parse(datetime);
            Timestamp timestamp = new Timestamp(date.getTime());
            return timestamp;
        } catch (ParseException e) {
            throw new RuntimeException(fmt("Unable to convert %s into timestamp", datetime));
        }
    }

    public static LocalDateTime toLocalDatetime(String datetime){
        String str = "2016-03-04 11:30";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.parse(datetime, formatter);
        return localDateTime;
    }

    public static String fmt(String format, Object... args){
        return String.format(format, args);
    }

    public static void main(String[] args) {
        System.out.println(getSHA256Hash("admin"));
        String word = "05/04/2020";
        System.out.println(toTimestamp(word));
        System.out.println(fmt("localtime %s",toLocalDatetime("2020-04-05 00:00:00")));
        System.out.println(fmt("localtime %s",toLocalDatetime("2020-04-05 10:00:00")));
    }
}
