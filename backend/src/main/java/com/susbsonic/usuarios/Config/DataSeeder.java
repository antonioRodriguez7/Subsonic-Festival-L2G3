package com.susbsonic.usuarios.Config;

import com.susbsonic.usuarios.models.DAO.Artist;
import com.susbsonic.usuarios.models.DAO.Space;
import com.susbsonic.usuarios.models.DAO.Ticket;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.RoleList;
import com.susbsonic.usuarios.Repositories.ArtistRepository;
import com.susbsonic.usuarios.Repositories.SpaceRepository;
import com.susbsonic.usuarios.Repositories.TicketCompradoRepository;
import com.susbsonic.usuarios.Repositories.TicketRepository;
import com.susbsonic.usuarios.Repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            TicketRepository ticketRepository,
            TicketCompradoRepository ticketCompradoRepository,
            ArtistRepository artistRepository,
            SpaceRepository spaceRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // == RESET: Borrar todo en orden seguro (respetando FKs) ==
            System.out.println("Reiniciando base de datos con datos del seeder...");
            ticketCompradoRepository.deleteAllInBatch(); // FK: depende de User y Ticket
            userRepository.deleteAllInBatch();
            ticketRepository.deleteAllInBatch();
            artistRepository.deleteAllInBatch();
            spaceRepository.deleteAllInBatch();

            // == 1. SEED USUARIOS ==
            User cliente = User.builder()
                    .name("Carlos")
                    .surname("Garcia")
                    .username("carlos_g")
                    .email("carlos@subsonic.com")
                    .password(passwordEncoder.encode("cliente123"))
                    .role(RoleList.ROLE_USER)
                    .isAdmin(false)
                    .bio("Asistente habitual al festival desde 2021. Fan del techno y el reggaeton.")
                    .build();

            User proveedor = User.builder()
                    .name("Laura")
                    .surname("Martinez")
                    .username("laura_m")
                    .email("laura@foodtrucks.com")
                    .password(passwordEncoder.encode("proveedor123"))
                    .role(RoleList.ROLE_PROVEEDOR)
                    .isAdmin(false)
                    .bio("Propietaria de Food Trucks and Co. Especializada en street food de calidad.")
                    .build();

            User admin = User.builder()
                    .name("Admin")
                    .surname("Subsonic")
                    .username("admin_subsonic")
                    .email("admin@subsonic.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(RoleList.ROLE_ADMIN)
                    .isAdmin(true)
                    .bio("Administrador general del Subsonic Festival 2026.")
                    .build();

            userRepository.saveAll(List.of(cliente, proveedor, admin));
            System.out.println("Usuarios creados.");

            // == 2. SEED TICKETS (ENTRADAS) ==
            Ticket general = Ticket.builder()
                    .category("ABONO GENERAL")
                    .price(72.50)
                    .description("Acceso a todos los escenarios durante los 3 dias del festival.")
                    .feature("MAS VENDIDO")
                    .imageUrl("/imgsTickets/ticketNormal.jpg")
                    .stock(5000)
                    .build();

            Ticket vip = Ticket.builder()
                    .category("ABONO VIP")
                    .price(155.0)
                    .description("Zona VIP exclusiva, acceso prioritario y barra privada.")
                    .feature("MUY LIMITADO")
                    .imageUrl("/imgsTickets/ticketVIP.jpg")
                    .stock(500)
                    .build();

            Ticket dreamVip = Ticket.builder()
                    .category("DREAM VIP")
                    .price(300.0)
                    .description("Experiencia premium completa, backstage y catering exclusivo.")
                    .feature("NOVEDAD")
                    .imageUrl("/imgsTickets/ticketDreamVIP.jpg")
                    .stock(50)
                    .build();

            ticketRepository.saveAll(List.of(general, vip, dreamVip));
            System.out.println("Tickets creados.");

            // == 3. SEED ARTISTAS ==
            LocalDate viernes = LocalDate.of(2026, 7, 17);
            LocalDate sabado = LocalDate.of(2026, 7, 18);
            LocalDate domingo = LocalDate.of(2026, 7, 19);

            List<Artist> artistas = List.of(
                    // Viernes 17
                    createArtist("Bad Bunny", viernes, "/artists/badbunny.avif", "https://open.spotify.com/intl-es/artist/4q3ewBCX7sLwd24euuV69X"),
                    createArtist("Rosalia", viernes, "/artists/rosalia.jpg", "https://open.spotify.com/intl-es/artist/7ltDVBr6mKbRvohxheJ9h1"),
                    createArtist("Martin Garrix", viernes, "/artists/martingarrix.jpg", "https://open.spotify.com/intl-es/artist/60d24wfXkVzDSfLS6hyCjZ"),
                    createArtist("Quevedo", viernes, "/artists/quevedo.jpg", "https://open.spotify.com/intl-es/artist/52iwsT98xCoGgiGntTiR7K"),
                    createArtist("Bizarrap", viernes, "/artists/biza.webp", "https://open.spotify.com/intl-es/artist/716NhGYqD1jl2wI1Qkgq36"),
                    createArtist("Charlotte de Witte", viernes, "/artists/charlotte.jpg", "https://open.spotify.com/intl-es/artist/1lJhME1ZpzsEa5M0wW6Mso"),
                    createArtist("Saiko", viernes, "/artists/saiko.jpg", "https://open.spotify.com/intl-es/artist/2O8vbr4RYPpk6MRA4fio7u"),
                    createArtist("Trueno", viernes, "/artists/trueno.jpg", "https://open.spotify.com/intl-es/artist/2x7PC78TmgqpEIjaGAZ0Oz"),
                    createArtist("Anuel AA", viernes, "/artists/anuel.jpg", "https://open.spotify.com/search/Anuel%20AA"),
                    createArtist("Amelie Lens", viernes, "/artists/amelielens.webp", "https://open.spotify.com/search/Amelie%20Lens"),
                    createArtist("Mora", viernes, "/artists/mora.jpg", "https://open.spotify.com/search/Mora"),
                    createArtist("Don Diablo", viernes, "/artists/dondiablo.jpg", "https://open.spotify.com/search/Don%20Diablo"),
                    createArtist("Vintage Culture", viernes, "/artists/vintage.jpg", "https://open.spotify.com/search/Vintage%20Culture"),

                    // Sabado 18
                    createArtist("Feid", sabado, "/artists/feid.webp", "https://open.spotify.com/search/Feid"),
                    createArtist("David Guetta", sabado, "/artists/davidguetta.jpeg", "https://open.spotify.com/search/David%20Guetta"),
                    createArtist("Karol G", sabado, "/artists/karolg.jpg", "https://open.spotify.com/search/Karol%20G"),
                    createArtist("Myke Towers", sabado, "/artists/myketowers.webp", "https://open.spotify.com/search/Myke%20Towers"),
                    createArtist("Carl Cox", sabado, "/artists/carlcox.jpg", "https://open.spotify.com/search/Carl%20Cox"),
                    createArtist("Tale Of Us", sabado, "/artists/tale.jpg", "https://open.spotify.com/search/Tale%20Of%20Us"),
                    createArtist("Dellafuente", sabado, "/artists/dellafuente.avif", "https://open.spotify.com/search/Dellafuente"),
                    createArtist("Peggy Gou", sabado, "/artists/peggy.webp", "https://open.spotify.com/search/Peggy%20Gou"),
                    createArtist("Anyma", sabado, "/artists/anyma.png", "https://open.spotify.com/search/Anyma"),
                    createArtist("Marco Trujillo", sabado, "/artists/trujillo.webp", "https://open.spotify.com/search/Marco%20Trujillo"),
                    createArtist("Aidan DJ", sabado, "/artists/aidan.webp", "https://open.spotify.com/search/Aidan%20DJ"),

                    // Domingo 19
                    createArtist("J Balvin", domingo, "/artists/jbalvin.jpg", "https://open.spotify.com/search/J%20Balvin"),
                    createArtist("Rauw Alejandro", domingo, "/artists/rauw.webp", "https://open.spotify.com/search/Rauw%20Alejandro"),
                    createArtist("Eladio Carrion", domingo, "/artists/eladio.jpeg", "https://open.spotify.com/search/Eladio%20Carrion"),
                    createArtist("Steve Aoki", domingo, "/artists/aoki.jpg", "https://open.spotify.com/search/Steve%20Aoki"),
                    createArtist("Central Cee", domingo, "/artists/centralcee.jpg", "https://open.spotify.com/search/Central%20Cee"),
                    createArtist("Bad Gyal", domingo, "/artists/badgyal.webp", "https://open.spotify.com/search/Bad%20Gyal"),
                    createArtist("Duki", domingo, "/artists/duki.jpg", "https://open.spotify.com/search/Duki"),
                    createArtist("Solomun", domingo, "/artists/solomun.jpg", "https://open.spotify.com/search/Solomun"),
                    createArtist("Alesso", domingo, "/artists/alesso.jpg", "https://open.spotify.com/search/Alesso")
            );

            artistRepository.saveAll(artistas);
            System.out.println("Artistas creados.");

            // == 4. SEED ESPACIOS ==
            List<Space> espacios = List.of(
                    Space.builder().name("Zona Velar").type("Norte").price(2500.0).sizeSquareMeters(500).isRented(false).build(),
                    Space.builder().name("Zona Paseo Central").type("Centro").price(1800.0).sizeSquareMeters(300).isRented(false).build(),
                    Space.builder().name("Zona Relax").type("Este").price(3200.0).sizeSquareMeters(800).isRented(true).build(),
                    Space.builder().name("Zona VIP").type("Centro").price(4500.0).sizeSquareMeters(150).isRented(false).build(),
                    Space.builder().name("Zona Innova").type("Sur").price(2800.0).sizeSquareMeters(600).isRented(false).build(),
                    Space.builder().name("Zona Oeste").type("Oeste").price(2000.0).sizeSquareMeters(400).isRented(false).build(),
                    Space.builder().name("Zona Boutique").type("Norte").price(1500.0).sizeSquareMeters(120).isRented(false).build(),
                    Space.builder().name("Zona Stage").type("Sur").price(5000.0).sizeSquareMeters(200).isRented(true).build()
            );

            spaceRepository.saveAll(espacios);
            System.out.println("Espacios creados.");
            System.out.println("Base de datos reiniciada correctamente.");
        };
    }

    private Artist createArtist(String name, LocalDate date, String imgUrl, String spotifyUrl) {
        return Artist.builder()
                .name(name)
                .performanceDate(date)
                .imageUrl(imgUrl)
                .spotifyUrl(spotifyUrl)
                .stage("Main Stage")
                .genre("General")
                .cache(10000.0)
                .description("Artista del Subsonic Festival")
                .build();
    }
}
