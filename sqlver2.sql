--
-- PostgreSQL database dump
--

\restrict 1uglIl3Pmv46VQisCZn6VPdBlrCPKO4R01QmikbXYjwWiykO9aqmytfUPFeyyOv

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-06 11:20:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 16677)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    user_id integer,
    showtime_id integer,
    total_amount numeric(18,2) NOT NULL,
    discount_amount numeric(18,2),
    final_amount numeric(18,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16676)
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_booking_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 234
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- TOC entry 220 (class 1259 OID 16562)
-- Name: cinemas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cinemas (
    cinema_id integer NOT NULL,
    name character varying,
    address text
);


ALTER TABLE public.cinemas OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16561)
-- Name: cinemas_cinema_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cinemas_cinema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cinemas_cinema_id_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 219
-- Name: cinemas_cinema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cinemas_cinema_id_seq OWNED BY public.cinemas.cinema_id;


--
-- TOC entry 243 (class 1259 OID 16750)
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_transactions (
    credit_transaction_id integer NOT NULL,
    refund_credit_id integer,
    booking_id integer,
    amount numeric(18,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    transaction_type character varying NOT NULL
);


ALTER TABLE public.credit_transactions OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16749)
-- Name: credit_transactions_credit_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credit_transactions_credit_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.credit_transactions_credit_transaction_id_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 242
-- Name: credit_transactions_credit_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credit_transactions_credit_transaction_id_seq OWNED BY public.credit_transactions.credit_transaction_id;


--
-- TOC entry 224 (class 1259 OID 16586)
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    genre_id integer NOT NULL,
    name character varying
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16585)
-- Name: genres_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genres_genre_id_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 223
-- Name: genres_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_genre_id_seq OWNED BY public.genres.genre_id;


--
-- TOC entry 227 (class 1259 OID 16608)
-- Name: movie_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.movie_genres OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16595)
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    description text,
    duration_minutes integer,
    age_rating character varying(10),
    review_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    title character varying,
    poster_url character varying,
    rating_avg numeric(3,2) DEFAULT '0'::numeric NOT NULL,
    director character varying,
    "cast" text,
    release_date date,
    trailer_url character varying,
    genre_id integer
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16594)
-- Name: movies_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_movie_id_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 225
-- Name: movies_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;


--
-- TOC entry 239 (class 1259 OID 16721)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    booking_id integer,
    amount numeric(18,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    payment_method character varying NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16720)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 238
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 241 (class 1259 OID 16735)
-- Name: refund_credits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund_credits (
    refund_credit_id integer NOT NULL,
    user_id integer,
    balance numeric(18,2) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refund_credits OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16734)
-- Name: refund_credits_refund_credit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refund_credits_refund_credit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refund_credits_refund_credit_id_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 240
-- Name: refund_credits_refund_credit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refund_credits_refund_credit_id_seq OWNED BY public.refund_credits.refund_credit_id;


--
-- TOC entry 245 (class 1259 OID 16769)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    movie_id integer,
    user_id integer,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16768)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 244
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- TOC entry 222 (class 1259 OID 16573)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    room_id integer CONSTRAINT screens_screen_id_not_null NOT NULL,
    cinema_id integer,
    seat_count integer,
    name character varying,
    status character varying DEFAULT 'AVAILABLE'::character varying
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 17340)
-- Name: rooms_room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rooms_room_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_room_id_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 246
-- Name: rooms_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rooms_room_id_seq OWNED BY public.rooms.room_id;


--
-- TOC entry 221 (class 1259 OID 16572)
-- Name: screens_screen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.screens_screen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.screens_screen_id_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 221
-- Name: screens_screen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.screens_screen_id_seq OWNED BY public.rooms.room_id;


--
-- TOC entry 237 (class 1259 OID 16697)
-- Name: seat_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seat_reservations (
    seat_reservation_id integer NOT NULL,
    showtime_id integer,
    booking_id integer,
    seat_id integer,
    price_at_booking numeric(18,2) NOT NULL,
    expired_at timestamp without time zone,
    status character varying NOT NULL
);


ALTER TABLE public.seat_reservations OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16696)
-- Name: seat_reservations_seat_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seat_reservations_seat_reservation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seat_reservations_seat_reservation_id_seq OWNER TO postgres;

--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 236
-- Name: seat_reservations_seat_reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seat_reservations_seat_reservation_id_seq OWNED BY public.seat_reservations.seat_reservation_id;


--
-- TOC entry 231 (class 1259 OID 16644)
-- Name: seats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seats (
    seat_id integer NOT NULL,
    room_id integer NOT NULL,
    row_index integer,
    column_index integer,
    seat_code character varying,
    seat_type character varying DEFAULT 'STANDARD'::character varying,
    price_multiplier numeric DEFAULT '1'::numeric NOT NULL,
    status character varying DEFAULT 'AVAILABLE'::character varying
);


ALTER TABLE public.seats OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16643)
-- Name: seats_seat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seats_seat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seats_seat_id_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 230
-- Name: seats_seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seats_seat_id_seq OWNED BY public.seats.seat_id;


--
-- TOC entry 229 (class 1259 OID 16626)
-- Name: showtimes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.showtimes (
    showtime_id integer NOT NULL,
    movie_id integer,
    room_id integer,
    base_price numeric(18,2) NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL
);


ALTER TABLE public.showtimes OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16625)
-- Name: showtimes_showtime_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.showtimes_showtime_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.showtimes_showtime_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 228
-- Name: showtimes_showtime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.showtimes_showtime_id_seq OWNED BY public.showtimes.showtime_id;


--
-- TOC entry 233 (class 1259 OID 16661)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    otp_expires_at timestamp without time zone,
    role character varying DEFAULT 'USER'::character varying NOT NULL,
    email character varying NOT NULL,
    password character varying,
    full_name character varying NOT NULL,
    google_id character varying,
    otp_code character varying,
    avatar_url character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16660)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 232
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4837 (class 2604 OID 16680)
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 16565)
-- Name: cinemas cinema_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cinemas ALTER COLUMN cinema_id SET DEFAULT nextval('public.cinemas_cinema_id_seq'::regclass);


--
-- TOC entry 4845 (class 2604 OID 16753)
-- Name: credit_transactions credit_transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_transactions ALTER COLUMN credit_transaction_id SET DEFAULT nextval('public.credit_transactions_credit_transaction_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 16589)
-- Name: genres genre_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN genre_id SET DEFAULT nextval('public.genres_genre_id_seq'::regclass);


--
-- TOC entry 4824 (class 2604 OID 16598)
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- TOC entry 4840 (class 2604 OID 16724)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 16738)
-- Name: refund_credits refund_credit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_credits ALTER COLUMN refund_credit_id SET DEFAULT nextval('public.refund_credits_refund_credit_id_seq'::regclass);


--
-- TOC entry 4847 (class 2604 OID 16772)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 17357)
-- Name: rooms room_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms ALTER COLUMN room_id SET DEFAULT nextval('public.rooms_room_id_seq'::regclass);


--
-- TOC entry 4839 (class 2604 OID 16700)
-- Name: seat_reservations seat_reservation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seat_reservations ALTER COLUMN seat_reservation_id SET DEFAULT nextval('public.seat_reservations_seat_reservation_id_seq'::regclass);


--
-- TOC entry 4829 (class 2604 OID 16647)
-- Name: seats seat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seats ALTER COLUMN seat_id SET DEFAULT nextval('public.seats_seat_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 16629)
-- Name: showtimes showtime_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showtimes ALTER COLUMN showtime_id SET DEFAULT nextval('public.showtimes_showtime_id_seq'::regclass);


--
-- TOC entry 4833 (class 2604 OID 16664)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5065 (class 0 OID 16677)
-- Dependencies: 235
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, user_id, showtime_id, total_amount, discount_amount, final_amount, created_at, status) FROM stdin;
\.


--
-- TOC entry 5050 (class 0 OID 16562)
-- Dependencies: 220
-- Data for Name: cinemas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cinemas (cinema_id, name, address) FROM stdin;
1	\N	\N
2	\N	\N
3	\N	\N
\.


--
-- TOC entry 5073 (class 0 OID 16750)
-- Dependencies: 243
-- Data for Name: credit_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_transactions (credit_transaction_id, refund_credit_id, booking_id, amount, created_at, transaction_type) FROM stdin;
\.


--
-- TOC entry 5054 (class 0 OID 16586)
-- Dependencies: 224
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (genre_id, name) FROM stdin;
4	Kinh dị
5	Khoa học viễn tưởng
6	Hoạt hình
7	Lãng mạn
1	Hành động
2	Hài kịch
3	Chính kịch
8	Cổ trang
9	Trinh thám
10	Phim tài liệu
\.


--
-- TOC entry 5057 (class 0 OID 16608)
-- Dependencies: 227
-- Data for Name: movie_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_genres (movie_id, genre_id) FROM stdin;
1	1
2	2
3	3
\.


--
-- TOC entry 5056 (class 0 OID 16595)
-- Dependencies: 226
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (movie_id, description, duration_minutes, age_rating, review_count, created_at, title, poster_url, rating_avg, director, "cast", release_date, trailer_url, genre_id) FROM stdin;
2	Phim tâm lý gia đình Việt Nam	115	T16	0	2026-01-24 11:14:30.218952	Kung Fu Panda 4	https://upload.wikimedia.org/wikipedia/vi/f/f6/Kung_Fu_Panda_4_poster.jpg	0.00	\N	\N	\N	\N	\N
3	Phim hoạt hình Nhật Bản	105	P	0	2026-01-24 11:14:30.218952	Dune: Part Two	https://upload.wikimedia.org/wikipedia/vi/5/52/Dune_Part_Two_poster.jpeg	0.00	\N	\N	\N	\N	\N
1	Phim về người nhện Marvel	148	P	0	2026-01-24 11:14:30.218952	Mai	https://upload.wikimedia.org/wikipedia/vi/2/22/Mai_phim_2024.jpg	0.00	\N	\N	\N	https://www.youtube.com/watch?v=abPmZCZZrFA&list=RDabPmZCZZrFA&start_radio=1	5
\.


--
-- TOC entry 5069 (class 0 OID 16721)
-- Dependencies: 239
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, booking_id, amount, created_at, payment_method, status) FROM stdin;
\.


--
-- TOC entry 5071 (class 0 OID 16735)
-- Dependencies: 241
-- Data for Name: refund_credits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund_credits (refund_credit_id, user_id, balance, created_at) FROM stdin;
\.


--
-- TOC entry 5075 (class 0 OID 16769)
-- Dependencies: 245
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, movie_id, user_id, rating, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5052 (class 0 OID 16573)
-- Dependencies: 222
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (room_id, cinema_id, seat_count, name, status) FROM stdin;
1	1	50	Phòng 1A	AVAILABLE
2	1	100	Phòng 1B	AVAILABLE
3	2	30	Phòng 1C	AVAILABLE
4	1	8	Phòng 2A	AVAILABLE
\.


--
-- TOC entry 5067 (class 0 OID 16697)
-- Dependencies: 237
-- Data for Name: seat_reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seat_reservations (seat_reservation_id, showtime_id, booking_id, seat_id, price_at_booking, expired_at, status) FROM stdin;
\.


--
-- TOC entry 5061 (class 0 OID 16644)
-- Dependencies: 231
-- Data for Name: seats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seats (seat_id, room_id, row_index, column_index, seat_code, seat_type, price_multiplier, status) FROM stdin;
2	1	1	2	\N	STANDARD	1	AVAILABLE
3	1	2	1	\N	STANDARD	1	AVAILABLE
1	1	1	1	\N	VIP	1.25	MAINTENANCE
4	2	1	1	\N	STANDARD	1	AVAILABLE
11	4	1	1	A1	STANDARD	1	AVAILABLE
12	4	1	2	A2	STANDARD	1	AVAILABLE
13	4	1	3	A3	STANDARD	1	AVAILABLE
14	4	1	4	A4	STANDARD	1	AVAILABLE
15	4	2	1	B1	STANDARD	1	AVAILABLE
16	4	2	2	B2	STANDARD	1	AVAILABLE
17	4	2	3	B3	STANDARD	1	AVAILABLE
18	4	2	4	B4	STANDARD	1	AVAILABLE
\.


--
-- TOC entry 5059 (class 0 OID 16626)
-- Dependencies: 229
-- Data for Name: showtimes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.showtimes (showtime_id, movie_id, room_id, base_price, start_time, end_time) FROM stdin;
1	1	1	90000.00	2026-02-01 18:00:00	2026-02-01 20:30:00
2	2	1	80000.00	2026-02-01 21:00:00	2026-02-01 23:00:00
3	3	2	120000.00	2026-02-02 09:00:00	2026-02-02 11:00:00
\.


--
-- TOC entry 5063 (class 0 OID 16661)
-- Dependencies: 233
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, is_verified, created_at, otp_expires_at, role, email, password, full_name, google_id, otp_code, avatar_url) FROM stdin;
5	f	2026-01-30 17:47:03.155547	2026-01-30 18:37:11.196	USER	khoitranaaaa@gmail.com	\N	tran khoi	109442790566110227249	419837	\N
6	t	2026-01-30 18:32:03.227484	\N	USER	deocobit2701@gmail.com	\N	Khôi Trần	109253217334082675108	\N	http://localhost:3000/upload/image-1769776453178-423369577.jpg
8	t	2026-01-31 08:29:34.911463	\N	admin	khoitran2701.ct@gmail.com	$2b$10$MFEd0rJYSbdn9Lzz4SmZJuONz9wgas.ZOSro.WWaP78wHht1OD1MG	Khôi	\N	\N	\N
9	f	2026-01-31 09:02:53.77123	\N	USER	1@gmail.com	$2b$10$w.VPihZAFdAuYrY8iwWofeUxgoxwFzkgqZ6ecorpMiC271C2sJXuW	1	\N	\N	\N
\.


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 234
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 4, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 219
-- Name: cinemas_cinema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cinemas_cinema_id_seq', 3, true);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 242
-- Name: credit_transactions_credit_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.credit_transactions_credit_transaction_id_seq', 1, false);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 223
-- Name: genres_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_genre_id_seq', 4, true);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 225
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 5, true);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 238
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 2, true);


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 240
-- Name: refund_credits_refund_credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refund_credits_refund_credit_id_seq', 3, true);


--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 244
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 3, true);


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 246
-- Name: rooms_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_room_id_seq', 4, true);


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 221
-- Name: screens_screen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.screens_screen_id_seq', 3, true);


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 236
-- Name: seat_reservations_seat_reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seat_reservations_seat_reservation_id_seq', 4, true);


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 230
-- Name: seats_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seats_seat_id_seq', 18, true);


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 228
-- Name: showtimes_showtime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.showtimes_showtime_id_seq', 5, true);


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 232
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 9, true);


--
-- TOC entry 4865 (class 2606 OID 17187)
-- Name: users UQ_0bd5012aeb82628e07f6a1be53b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE (google_id);


--
-- TOC entry 4877 (class 2606 OID 17212)
-- Name: refund_credits UQ_5582cebca6d20f4e1bcc8e1893e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_credits
    ADD CONSTRAINT "UQ_5582cebca6d20f4e1bcc8e1893e" UNIQUE (user_id);


--
-- TOC entry 4867 (class 2606 OID 17184)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 4871 (class 2606 OID 16685)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4850 (class 2606 OID 16571)
-- Name: cinemas cinemas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cinemas
    ADD CONSTRAINT cinemas_pkey PRIMARY KEY (cinema_id);


--
-- TOC entry 4881 (class 2606 OID 16757)
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (credit_transaction_id);


--
-- TOC entry 4854 (class 2606 OID 16593)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genre_id);


--
-- TOC entry 4858 (class 2606 OID 16614)
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (movie_id, genre_id);


--
-- TOC entry 4856 (class 2606 OID 16607)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- TOC entry 4875 (class 2606 OID 16728)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4879 (class 2606 OID 16743)
-- Name: refund_credits refund_credits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_credits
    ADD CONSTRAINT refund_credits_pkey PRIMARY KEY (refund_credit_id);


--
-- TOC entry 4883 (class 2606 OID 16779)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4852 (class 2606 OID 16579)
-- Name: rooms screens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT screens_pkey PRIMARY KEY (room_id);


--
-- TOC entry 4873 (class 2606 OID 16704)
-- Name: seat_reservations seat_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seat_reservations
    ADD CONSTRAINT seat_reservations_pkey PRIMARY KEY (seat_reservation_id);


--
-- TOC entry 4863 (class 2606 OID 16652)
-- Name: seats seats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (seat_id);


--
-- TOC entry 4860 (class 2606 OID 16632)
-- Name: showtimes showtimes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT showtimes_pkey PRIMARY KEY (showtime_id);


--
-- TOC entry 4869 (class 2606 OID 16673)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4861 (class 1259 OID 17371)
-- Name: UQ_ROOM_ROW_COL; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UQ_ROOM_ROW_COL" ON public.seats USING btree (room_id, row_index, column_index);


--
-- TOC entry 4898 (class 2606 OID 17312)
-- Name: credit_transactions FK_21d451a07cd808c245fb03b85de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT "FK_21d451a07cd808c245fb03b85de" FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- TOC entry 4891 (class 2606 OID 17322)
-- Name: bookings FK_311925ef3f94966ea9482de9df3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FK_311925ef3f94966ea9482de9df3" FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id);


--
-- TOC entry 4897 (class 2606 OID 17287)
-- Name: refund_credits FK_5582cebca6d20f4e1bcc8e1893e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_credits
    ADD CONSTRAINT "FK_5582cebca6d20f4e1bcc8e1893e" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4900 (class 2606 OID 17277)
-- Name: reviews FK_563501cf3faa75a1ca40be84f82; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_563501cf3faa75a1ca40be84f82" FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- TOC entry 4892 (class 2606 OID 17317)
-- Name: bookings FK_64cd97487c5c42806458ab5520c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FK_64cd97487c5c42806458ab5520c" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4890 (class 2606 OID 17372)
-- Name: seats FK_657a29871b8dd6a5107da320458; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT "FK_657a29871b8dd6a5107da320458" FOREIGN KEY (room_id) REFERENCES public.rooms(room_id);


--
-- TOC entry 4901 (class 2606 OID 17282)
-- Name: reviews FK_728447781a30bc3fcfe5c2f1cdf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4888 (class 2606 OID 17358)
-- Name: showtimes FK_7dac5a1df6dbc1f355112a11d8d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT "FK_7dac5a1df6dbc1f355112a11d8d" FOREIGN KEY (room_id) REFERENCES public.rooms(room_id);


--
-- TOC entry 4899 (class 2606 OID 17307)
-- Name: credit_transactions FK_9147b3cc97a63c118ff31ad26fa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT "FK_9147b3cc97a63c118ff31ad26fa" FOREIGN KEY (refund_credit_id) REFERENCES public.refund_credits(refund_credit_id);


--
-- TOC entry 4893 (class 2606 OID 17257)
-- Name: seat_reservations FK_965c82d7345d222798f9cb5f501; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seat_reservations
    ADD CONSTRAINT "FK_965c82d7345d222798f9cb5f501" FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- TOC entry 4886 (class 2606 OID 17297)
-- Name: movie_genres FK_ae967ce58ef99e9ff3933ccea48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT "FK_ae967ce58ef99e9ff3933ccea48" FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- TOC entry 4884 (class 2606 OID 17352)
-- Name: rooms FK_b7e045af2f3b84e1f2cef0e3dd5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "FK_b7e045af2f3b84e1f2cef0e3dd5" FOREIGN KEY (cinema_id) REFERENCES public.cinemas(cinema_id);


--
-- TOC entry 4887 (class 2606 OID 17302)
-- Name: movie_genres FK_bbbc12542564f7ff56e36f5bbf6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT "FK_bbbc12542564f7ff56e36f5bbf6" FOREIGN KEY (genre_id) REFERENCES public.genres(genre_id);


--
-- TOC entry 4889 (class 2606 OID 17242)
-- Name: showtimes FK_cbe689b0c116fbc866d8ea21759; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT "FK_cbe689b0c116fbc866d8ea21759" FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- TOC entry 4894 (class 2606 OID 17252)
-- Name: seat_reservations FK_cd6f11c153a5fa99c6bf9d0d551; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seat_reservations
    ADD CONSTRAINT "FK_cd6f11c153a5fa99c6bf9d0d551" FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id);


--
-- TOC entry 4885 (class 2606 OID 17327)
-- Name: movies FK_cf3f214b7bdb6bc5e641930ee6b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT "FK_cf3f214b7bdb6bc5e641930ee6b" FOREIGN KEY (genre_id) REFERENCES public.genres(genre_id);


--
-- TOC entry 4896 (class 2606 OID 17292)
-- Name: payments FK_e86edf76dc2424f123b9023a2b2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2" FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- TOC entry 4895 (class 2606 OID 17262)
-- Name: seat_reservations FK_feabbd23b59929b13c9f28be15a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seat_reservations
    ADD CONSTRAINT "FK_feabbd23b59929b13c9f28be15a" FOREIGN KEY (seat_id) REFERENCES public.seats(seat_id);


-- Completed on 2026-02-06 11:20:39

--
-- PostgreSQL database dump complete
--

\unrestrict 1uglIl3Pmv46VQisCZn6VPdBlrCPKO4R01QmikbXYjwWiykO9aqmytfUPFeyyOv

