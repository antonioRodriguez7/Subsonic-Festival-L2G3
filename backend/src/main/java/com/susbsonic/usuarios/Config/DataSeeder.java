package com.susbsonic.usuarios.Config;

import com.susbsonic.usuarios.models.AuthProvider;
import com.susbsonic.usuarios.models.DAO.Artist;
import com.susbsonic.usuarios.models.DAO.ProviderService;
import com.susbsonic.usuarios.models.DAO.Space;
import com.susbsonic.usuarios.models.DAO.Ticket;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.RoleList;
import com.susbsonic.usuarios.Repositories.ArtistRepository;
import com.susbsonic.usuarios.Repositories.ProviderServiceRepository;
import com.susbsonic.usuarios.Repositories.RentedSpaceRepository;
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
            ProviderServiceRepository providerServiceRepository,
            RentedSpaceRepository rentedSpaceRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // == RESET: Borrar todo en orden seguro (respetando FKs) ==
            System.out.println("Reiniciando base de datos con datos del seeder...");
            // 1º: tablas auxiliares que dependen de varias entidades
            rentedSpaceRepository.deleteAllInBatch(); // FK: depende de User y Space
            providerServiceRepository.deleteAllInBatch();  // FK: depende de User y Space
            ticketCompradoRepository.deleteAllInBatch();   // FK: depende de User y Ticket
            // 2º: entidades principales (sin dependencias entre sí)
            spaceRepository.deleteAllInBatch();
            ticketRepository.deleteAllInBatch();
            artistRepository.deleteAllInBatch();
            userRepository.deleteAllInBatch();


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
                    .provider(AuthProvider.LOCAL)
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
                    .provider(AuthProvider.LOCAL)
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
                    .provider(AuthProvider.LOCAL)
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
                    createArtist("Anuel AA", viernes, "/artists/anuel.jpg", "https://open.spotify.com/intl-es/artist/2R21vXR83lH98kGeO99Y66"),
                    createArtist("Amelie Lens", viernes, "/artists/amelielens.webp", "https://open.spotify.com/intl-es/artist/5Ho1vKl1Uz8bJlk4vbmvmf"),
                    createArtist("Mora", viernes, "/artists/mora.jpg", "https://open.spotify.com/intl-es/artist/0Q8NcsJwoCbZOHHW63su5S"),
                    createArtist("Don Diablo", viernes, "/artists/dondiablo.jpg", "https://open.spotify.com/intl-es/artist/1l2ekx5skC4gJH8djERwh1"),
                    createArtist("Vintage Culture", viernes, "/artists/vintage.jpg", "https://open.spotify.com/intl-es/artist/28uJnu5EsrGml2tBd7y8ts"),

                    // Sabado 18
                    createArtist("Feid", sabado, "/artists/feid.webp", "https://open.spotify.com/intl-es/artist/2LRoIwlKmHjgvigdNGBHNo"),
                    createArtist("David Guetta", sabado, "/artists/davidguetta.jpeg", "https://open.spotify.com/intl-es/artist/1Cs0zKBU1kc0i8ypK3B9ai"),
                    createArtist("Karol G", sabado, "/artists/karolg.jpg", "https://open.spotify.com/intl-es/artist/790FomKkXshlbRYZFtlgla"),
                    createArtist("Myke Towers", sabado, "/artists/myketowers.webp", "https://open.spotify.com/intl-es/artist/7iK8PXO48WeuP03g8YR51W"),
                    createArtist("Carl Cox", sabado, "/artists/carlcox.jpg", "https://open.spotify.com/intl-es/artist/19SmlbABtI4bXz864MLqOS"),
                    createArtist("Tale Of Us", sabado, "/artists/tale.jpg", "https://open.spotify.com/intl-es/artist/1UL813H5aj3e8ekE5RqWqc"),
                    createArtist("Dellafuente", sabado, "/artists/dellafuente.avif", "https://open.spotify.com/intl-es/artist/4bJh7sMPcVRiqe5jlnsWQV"),
                    createArtist("Peggy Gou", sabado, "/artists/peggy.webp", "https://open.spotify.com/intl-es/artist/2mLA48B366zkELXYx7hcDN"),
                    createArtist("Anyma", sabado, "/artists/anyma.png", "https://open.spotify.com/intl-es/artist/4iBwchw0U0GZv5RfVYSMxN"),
/* 
No se quien es Marco Trujillo
                    createArtist("Marco Trujillo", sabado, "/artists/trujillo.webp", "https://open.spotify.com/search/Marco%20Trujillo"),
 Aiden DJ es Aiden Music
 
 */                    createArtist("Aidan DJ", sabado, "/artists/aidan.webp", "https://open.spotify.com/intl-es/artist/6M4QfNzj433rXVijCYpKoB"),

                    // Domingo 19
                    createArtist("J Balvin", domingo, "/artists/jbalvin.jpg", "https://open.spotify.com/intl-es/artist/1vyhD5VmyZ7KMfW5gqLgo5"),
                    createArtist("Rauw Alejandro", domingo, "/artists/rauw.webp", "https://open.spotify.com/intl-es/artist/1mcTU81TzQhprhouKaTkpq"),
                    createArtist("Eladio Carrion", domingo, "/artists/eladio.jpeg", "https://open.spotify.com/intl-es/artist/5XJDexmWFLWOkjOEjOVX3e"),
                    createArtist("Steve Aoki", domingo, "/artists/aoki.jpg", "https://open.spotify.com/intl-es/artist/77AiFEVeAVj2ORpC85QVJs"),
                    createArtist("Central Cee", domingo, "/artists/centralcee.jpg", "https://open.spotify.com/intl-es/artist/5H4yInM5zmHqpKIoMNAx4r"),
                    createArtist("Bad Gyal", domingo, "/artists/badgyal.webp", "https://open.spotify.com/intl-es/artist/4F4pp8NUW08JuXwnoxglpN"),
                    createArtist("Duki", domingo, "/artists/duki.jpg", "https://open.spotify.com/intl-es/artist/1bAftSH8umNcGZ0uyV7LMg"),
                    createArtist("Solomun", domingo, "/artists/solomun.jpg", "https://open.spotify.com/intl-es/artist/5wJK4kQAkVGjqM9x46KQOC"),
                    createArtist("Alesso", domingo, "/artists/alesso.jpg", "https://open.spotify.com/intl-es/artist/4AVFqumd2ogHFlRbKIjp1t")
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
                    Space.builder().name("Zona Stage").type("Sur").price(5000.0).sizeSquareMeters(200).isRented(false).build()
            );

            spaceRepository.saveAll(espacios);
            System.out.println("Espacios creados.");

            // == 5. SEED SERVICIOS DE PROVEEDOR ==
            Space espacioCamping  = espacios.get(0); // Zona Velar
            Space espacioComida   = espacios.get(1); // Zona Paseo Central
            Space espacioTransp   = espacios.get(2); // Zona Relax
            Space espacioMerch    = espacios.get(6); // Zona Boutique
            Space espacioTaquilla = espacios.get(4); // Zona Innova

            List<ProviderService> servicios = List.of(
                    ProviderService.builder()
                            .nombre("Food & Trucks")
                            .tipo("Restauraci\u00f3n")
                            .descripcion("Amplia variedad de foodtrucks y barras premium con opciones para todos los gustos. Cocina internacional, opciones veganas y c\u00f3cteles premium.")
                            .fechas("17-19 Julio 2026")
                            .imagenUrl("/servicios/comidarapida.png")
                            .provider(proveedor)
                            .space(espacioComida)
                            .build(),
                    ProviderService.builder()
                            .nombre("Transporte Subsonic")
                            .tipo("Transporte")
                            .descripcion("Lanzaderas desde las principales ciudades, zona de parking gratuito y punto de taxis y VTC. Facilita tu llegada al festival.")
                            .fechas("17-19 Julio 2026")
                            .imagenUrl("/servicios/transporte.jpg")
                            .provider(proveedor)
                            .space(espacioTransp)
                            .build(),
                    ProviderService.builder()
                            .nombre("Camping Subsonic")
                            .tipo("Otro")
                            .descripcion("Zona de acampada oficial con camping general y glamping. Duchas y ba\u00f1os 24h, zona de descanso y sombra para vivir la experiencia completa.")
                            .fechas("17-19 Julio 2026")
                            .imagenUrl("/servicios/camping.jpeg")
                            .provider(proveedor)
                            .space(espacioCamping)
                            .build(),
                    ProviderService.builder()
                            .nombre("Merchandising Subsonic")
                            .tipo("Merchandising")
                            .descripcion("Ll\u00e9vate un recuerdo \u00fanico del festival. Camisetas y sudaderas oficiales, ediciones limitadas y accesorios exclusivos.")
                            .fechas("17-19 Julio 2026")
                            .imagenUrl("/servicios/merchandising.jpg")
                            .provider(proveedor)
                            .space(espacioMerch)
                            .build(),
                    ProviderService.builder()
                            .nombre("Taquillas Seguras")
                            .tipo("Otro")
                            .descripcion("Guarda tus pertenencias de forma segura. Taquillas individuales y grupales, acceso ilimitado durante el evento y carga de dispositivos.")
                            .fechas("17-19 Julio 2026")
                            .imagenUrl("/servicios/taquillas.jpg")
                            .provider(proveedor)
                            .space(espacioTaquilla)
                            .build()
            );
            providerServiceRepository.saveAll(servicios);
            System.out.println("Servicios de proveedor creados.");

            // == 6. SEED ESPACIOS ALQUILADOS ==
            // Asociar esos espacios como alquilados formalmente por el proveedor
            List<com.susbsonic.usuarios.models.DAO.RentedSpace> alquileres = List.of(
                    com.susbsonic.usuarios.models.DAO.RentedSpace.builder().provider(proveedor).space(espacioCamping).rentDate(java.time.LocalDateTime.now()).build(),
                    com.susbsonic.usuarios.models.DAO.RentedSpace.builder().provider(proveedor).space(espacioComida).rentDate(java.time.LocalDateTime.now()).build(),
                    com.susbsonic.usuarios.models.DAO.RentedSpace.builder().provider(proveedor).space(espacioTransp).rentDate(java.time.LocalDateTime.now()).build(),
                    com.susbsonic.usuarios.models.DAO.RentedSpace.builder().provider(proveedor).space(espacioMerch).rentDate(java.time.LocalDateTime.now()).build(),
                    com.susbsonic.usuarios.models.DAO.RentedSpace.builder().provider(proveedor).space(espacioTaquilla).rentDate(java.time.LocalDateTime.now()).build()
            );
            rentedSpaceRepository.saveAll(alquileres);

            espacioCamping.setIsRented(true);
            espacioComida.setIsRented(true);
            espacioTransp.setIsRented(true);
            espacioMerch.setIsRented(true);
            espacioTaquilla.setIsRented(true);
            spaceRepository.saveAll(List.of(espacioCamping, espacioComida, espacioTransp, espacioMerch, espacioTaquilla));
            System.out.println("Alquileres de proveedor asignados.");

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
