--
-- PostgreSQL database dump
--

\restrict 5KCdKHwuc3uLsu6okYZ7uNFTA01RpAcO9GuxV63FZRkhpgWDtrkkWGsYiuxdEaZ

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

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
-- Name: dock_allocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dock_allocation (
    dock_allocation_id character varying(50) NOT NULL,
    gate_entry_id character varying(50) NOT NULL,
    dock_id character varying(50) NOT NULL,
    assigned_by character varying(50),
    assigned_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    unloading_start_time timestamp without time zone,
    unloading_end_time timestamp without time zone,
    status character varying(20),
    remarks text
);


ALTER TABLE public.dock_allocation OWNER TO postgres;

--
-- Name: dock_allocations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dock_allocations (
    dock_allocation_id character varying(30) NOT NULL,
    gate_entry_id character varying(36) NOT NULL,
    dock_id character varying(36) NOT NULL,
    allocated_at timestamp without time zone,
    allocated_by character varying(36),
    status character varying(30),
    remarks text
);


ALTER TABLE public.dock_allocations OWNER TO postgres;

--
-- Name: docks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.docks (
    dock_id character varying NOT NULL,
    dock_code character varying,
    warehouse_id character varying,
    status character varying,
    created_at timestamp without time zone
);


ALTER TABLE public.docks OWNER TO postgres;

--
-- Name: gate_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gate_documents (
    id character varying(36) NOT NULL,
    gate_entry_id character varying(30) NOT NULL,
    document_type character varying(30),
    document_number character varying(100),
    document_url text,
    created_at timestamp without time zone
);


ALTER TABLE public.gate_documents OWNER TO postgres;

--
-- Name: gate_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gate_entries (
    gate_entry_id character varying(30) NOT NULL,
    warehouse_id character varying(30) NOT NULL,
    gate_id character varying(30) NOT NULL,
    entry_type character varying(30) NOT NULL,
    movement_type character varying(10) NOT NULL,
    reference_no character varying(100),
    vehicle_number character varying(20),
    driver_name character varying(100),
    driver_phone character varying(20),
    person_name character varying(100),
    company_name character varying(100),
    entry_time timestamp without time zone NOT NULL,
    exit_time timestamp without time zone,
    recorded_by character varying(30),
    remarks text,
    created_at timestamp without time zone,
    is_approved boolean,
    approved_by character varying(30),
    approved_at timestamp without time zone,
    status character varying(20)
);


ALTER TABLE public.gate_entries OWNER TO postgres;

--
-- Name: gate_entry_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gate_entry_photos (
    id character varying(36) NOT NULL,
    gate_entry_id character varying(30) NOT NULL,
    photo_type text,
    captured_at timestamp without time zone
);


ALTER TABLE public.gate_entry_photos OWNER TO postgres;

--
-- Name: gate_material_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gate_material_details (
    id character varying(36) NOT NULL
);


ALTER TABLE public.gate_material_details OWNER TO postgres;

--
-- Name: gate_vehicle_inspection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gate_vehicle_inspection (
    id character varying(36) NOT NULL,
    gate_entry_id character varying(36) NOT NULL,
    vehicle_condition_ok boolean,
    seal_number character varying(50),
    seal_intact boolean,
    temperature_ok boolean,
    inspected_by character varying(30),
    inspected_at timestamp without time zone
);


ALTER TABLE public.gate_vehicle_inspection OWNER TO postgres;

--
-- Name: id_counters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.id_counters (
    entity character varying(20) NOT NULL,
    last_serial integer NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.id_counters OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    permission_id character varying(30) NOT NULL,
    module character varying(50),
    action character varying(50),
    permission_code character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id character varying(30) NOT NULL,
    permission_id character varying(30) NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id character varying(30) NOT NULL,
    role_code character varying(30) NOT NULL,
    role_name character varying(50) NOT NULL,
    description text,
    is_system boolean,
    created_at timestamp without time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: security_gates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.security_gates (
    gate_id character varying(30) NOT NULL,
    warehouse_id character varying(36) NOT NULL,
    gate_code character varying(30) NOT NULL,
    gate_name character varying(100),
    gate_type character varying(30),
    is_active boolean,
    created_at timestamp without time zone
);


ALTER TABLE public.security_gates OWNER TO postgres;

--
-- Name: unloading_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unloading_details (
    unloading_id character varying(50) NOT NULL,
    gate_entry_id character varying(50) NOT NULL,
    dock_allocation_id character varying(50),
    staging_area character varying(50),
    total_cartoons integer,
    unloaded_by character varying(50),
    unloading_start timestamp without time zone,
    unloading_end timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.unloading_details OWNER TO postgres;

--
-- Name: unloading_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unloading_photos (
    photo_id character varying(50) NOT NULL,
    unloading_id character varying(50),
    photo_url text,
    photo_type character varying(50),
    upoaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.unloading_photos OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_role_id character varying(30) NOT NULL,
    user_id character varying(30) NOT NULL,
    role_id character varying(30) NOT NULL,
    assigned_at timestamp without time zone,
    assigned_by character varying(36)
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_warehouses (
    user_id character varying(30) NOT NULL,
    warehouse_id character varying(30) NOT NULL
);


ALTER TABLE public.user_warehouses OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id character varying(30) NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100),
    phone character varying(20),
    password_hash text NOT NULL,
    is_active boolean,
    is_locked boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    last_login_at timestamp without time zone,
    force_password_change boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    warehouse_id character varying(30) NOT NULL,
    warehouse_code character varying(50) NOT NULL,
    warehouse_name character varying(255) NOT NULL,
    status character varying(20),
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(100),
    state character varying(100),
    country character varying(100),
    postal_code character varying(20),
    total_area_sqft numeric(10,2),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- Data for Name: dock_allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dock_allocation (dock_allocation_id, gate_entry_id, dock_id, assigned_by, assigned_time, unloading_start_time, unloading_end_time, status, remarks) FROM stdin;
DOCK_ALLOC_001	GE_14032026_170254_0001	DOCK_001	\N	2026-04-05 09:27:41.53863	\N	\N	ASSIGNED	\N
\.


--
-- Data for Name: dock_allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dock_allocations (dock_allocation_id, gate_entry_id, dock_id, allocated_at, allocated_by, status, remarks) FROM stdin;
DOCK_ALLOC-004	GE_18032026_194703_0001	DOCK-002	2026-04-05 14:22:39.822018	\N	ASSIGNED	\N
\.


--
-- Data for Name: docks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.docks (dock_id, dock_code, warehouse_id, status, created_at) FROM stdin;
DOCK_001	DOCK-01	WH_10032026_205148_0001	OCCUPIED	2026-03-31 16:32:37.946583
DOCK-002	DOCK-02	WH_10032026_205148_0001	OCCUPIED	2026-04-05 14:07:07.644577
\.


--
-- Data for Name: gate_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gate_documents (id, gate_entry_id, document_type, document_number, document_url, created_at) FROM stdin;
\.


--
-- Data for Name: gate_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gate_entries (gate_entry_id, warehouse_id, gate_id, entry_type, movement_type, reference_no, vehicle_number, driver_name, driver_phone, person_name, company_name, entry_time, exit_time, recorded_by, remarks, created_at, is_approved, approved_by, approved_at, status) FROM stdin;
GE_14032026_170254_0001	WH_12032026_162627_0002	GATE_14032026_165540_0001	VEHICLE	ENTRY	\N	MH12AB1234	Ramesh	9876543210	\N	ABC Logistics	2026-03-14 11:32:54.033032	\N	\N	\N	2026-03-14 11:32:54.037421	f	\N	\N	\N
GE_18032026_194703_0001	WH_10032026_205148_0001	GATE_14032026_165540_0001	Visitor	Entry	Test_001	MH04AT4943	TestUser	99xxxxxx89		lorem	2026-03-18 14:17:03.294818	\N	USR_12032026_143824_0001	\N	2026-03-18 14:17:03.313859	f	\N	\N	\N
GE_001	WH_10032026_205148_0001	GATE_14032026_165540_0001	VEHICLE	ENTRY	\N	\N	\N	\N	\N	\N	2026-04-05 09:05:18.466956	\N	USR_12032026_143824_0001	\N	2026-04-05 09:05:18.470258	\N	\N	\N	pending
\.


--
-- Data for Name: gate_entry_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gate_entry_photos (id, gate_entry_id, photo_type, captured_at) FROM stdin;
\.


--
-- Data for Name: gate_material_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gate_material_details (id) FROM stdin;
\.


--
-- Data for Name: gate_vehicle_inspection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gate_vehicle_inspection (id, gate_entry_id, vehicle_condition_ok, seal_number, seal_intact, temperature_ok, inspected_by, inspected_at) FROM stdin;
GINSP_18032026_194703_0001	GE_18032026_194703_0001	t		t	t	USR_12032026_143824_0001	2026-03-18 14:17:03.365867
\.


--
-- Data for Name: id_counters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.id_counters (entity, last_serial, date) FROM stdin;
GE	1	2026-03-31
DOCK	1	2026-03-31
GE	1	2026-04-05
DOCK_ALLOC	1	2026-04-05
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (permission_id, module, action, permission_code, description) FROM stdin;
PERM_10032026_204401_0001	gate	view	gate.view	view access for gate
PERM_10032026_204401_0002	gate	create	gate.create	create access for gate
PERM_10032026_204401_0003	gate	update	gate.update	update access for gate
PERM_10032026_204401_0004	gate	approve	gate.approve	approve access for gate
PERM_10032026_204401_0005	warehouse	view	warehouse.view	view access for warehouse
PERM_10032026_204401_0006	warehouse	manage	warehouse.manage	manage access for warehouse
PERM_10032026_204401_0007	user	view	user.view	view access for user
PERM_10032026_204401_0008	user	manage	user.manage	manage access for user
PERM_10032026_204401_0009	role	manage	role.manage	manage access for role
PERM_DOCK_CREATE	dock	create	dock.create	\N
PERM_DOCK_VIEW	dock	view	dock.view	\N
PERM_DOCK_UPDATE	dock	update	dock.update	\N
PERM_DOCK_ALLOCATE	dock	allocate	dock.allocate	\N
PERM_DOCK_START	dock	start	dock.unload.start	\N
PERM_DOCK_COMPLETE	dock	complete	dock.unload.complete	\N
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
ROLE_10032026_204401_0005	PERM_10032026_204401_0001
ROLE_10032026_204401_0005	PERM_10032026_204401_0002
ROLE_10032026_204401_0005	PERM_10032026_204401_0004
ROLE_10032026_204401_0005	PERM_10032026_204401_0005
ROLE_10032026_204401_0005	PERM_10032026_204401_0006
ROLE_10032026_204401_0005	PERM_10032026_204401_0007
ROLE_10032026_204401_0005	PERM_10032026_204401_0008
ROLE_10032026_204401_0005	PERM_10032026_204401_0009
ROLE_10032026_204401_0005	PERM_10032026_204401_0003
ROLE_20032026_161644_0001	PERM_10032026_204401_0001
ROLE_20032026_161644_0001	PERM_10032026_204401_0002
ROLE_20032026_161644_0001	PERM_10032026_204401_0003
ROLE_20032026_161644_0002	PERM_10032026_204401_0001
ROLE_20032026_161644_0002	PERM_10032026_204401_0003
ROLE_20032026_161644_0003	PERM_10032026_204401_0001
ROLE_20032026_161644_0003	PERM_10032026_204401_0003
ROLE_20032026_161644_0004	PERM_10032026_204401_0001
ROLE_20032026_161644_0004	PERM_10032026_204401_0004
ROLE_10032026_204401_0005	PERM_DOCK_CREATE
ROLE_10032026_204401_0005	PERM_DOCK_VIEW
ROLE_10032026_204401_0005	PERM_DOCK_UPDATE
ROLE_10032026_204401_0005	PERM_DOCK_ALLOCATE
ROLE_10032026_204401_0005	PERM_DOCK_START
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_code, role_name, description, is_system, created_at) FROM stdin;
ROLE_10032026_204401_0005	WMS_ADMIN	WMS Admin	\N	f	2026-03-10 15:14:01.463231
ROLE_20032026_161644_0001	SECURITY	Security	\N	f	2026-03-20 10:46:44.606756
ROLE_20032026_161644_0002	WAREHOUSE_EXEC	warehouse Executive	\N	f	2026-03-20 10:46:44.630916
ROLE_20032026_161644_0003	QC_EXEC	QC Executive	\N	f	2026-03-20 10:46:44.654359
ROLE_20032026_161644_0004	SUPERVISOR	Supervisor	\N	f	2026-03-20 10:46:44.665126
\.


--
-- Data for Name: security_gates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.security_gates (gate_id, warehouse_id, gate_code, gate_name, gate_type, is_active, created_at) FROM stdin;
GATE_14032026_165540_0001	WH_12032026_162627_0002	GATE01	Main Entry Gate	ENTRY_EXIT	t	2026-03-14 11:25:40.613234
GATE_14032026_165604_0002	WH_12032026_162627_0002	GATE02	Main Entry Gate	ENTRY_EXIT	t	2026-03-14 11:26:04.847257
\.


--
-- Data for Name: unloading_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unloading_details (unloading_id, gate_entry_id, dock_allocation_id, staging_area, total_cartoons, unloaded_by, unloading_start, unloading_end, created_at) FROM stdin;
\.


--
-- Data for Name: unloading_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unloading_photos (photo_id, unloading_id, photo_url, photo_type, upoaded_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_role_id, user_id, role_id, assigned_at, assigned_by) FROM stdin;
USRROLE_12032026_143824_0001	USR_12032026_143824_0001	ROLE_10032026_204401_0005	2026-03-12 09:08:24.962706	USR_12032026_143824_0001
USRROLE_002	USR_002	ROLE_20032026_161644_0003	2026-03-22 12:20:34.963804	\N
USRROLE_003	USR_003	ROLE_20032026_161644_0003	2026-03-28 15:16:28.659531	\N
USRROLE_004	USR_004	ROLE_20032026_161644_0004	2026-03-29 10:51:31.192395	\N
\.


--
-- Data for Name: user_warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_warehouses (user_id, warehouse_id) FROM stdin;
USR_12032026_143824_0001	WH_10032026_205148_0001
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, phone, password_hash, is_active, is_locked, created_at, updated_at, last_login_at, force_password_change) FROM stdin;
USR_12032026_143824_0001	admin	admin@wms.com	\N	$2b$12$54mM.F9IkRqzT4ut6LS3OeiP3sMhPszriTivoHcHPY8MsuVwuX06a	t	f	2026-03-12 09:08:24.939414	2026-03-12 09:08:24.939419	\N	f
USR_002	tester	tester@email.com	\N	$2b$12$H5NlF62uAG5ogmSk6BWzceGGjCNhJD390gacNNFj7fYwBFpWCF7EK	t	f	2026-03-22 12:20:34.952313	2026-03-22 12:20:34.952327	\N	t
USR_003	tester01	tester01@gmail.com		$2b$12$0EsgqpBsJpQZBV.7QV0rkOqJiPXMmbp2/xHJ.uP9WDj4egKO5fEs.	t	f	2026-03-28 15:16:28.65339	2026-03-28 15:16:28.653398	\N	t
USR_004	supervisor	\N	\N	$2b$12$MgELeHWyeJuED/UVLyH82eD/I5Lw5Mfw6wIBK2/zAYLh0IBrS34Ee	t	f	2026-03-29 10:51:31.153107	2026-03-29 10:51:31.153115	\N	f
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (warehouse_id, warehouse_code, warehouse_name, status, address_line1, address_line2, city, state, country, postal_code, total_area_sqft, created_at, updated_at) FROM stdin;
WH_10032026_205148_0001	WH001	Main Warehouse	ACTIVE	\N	\N	Navi Mumbai	Maharashtra	India	\N	10000.00	2026-03-10 15:21:48.910127	2026-03-10 15:21:48.910137
WH_12032026_160918_0001	WH003	Pune Warehouse	ACTIVE			Pune	Maharashtra	India		\N	2026-03-12 10:39:18.131395	2026-03-12 10:39:18.131402
WH_12032026_162627_0002	WH002	Secondary Warehouse	ACTIVE			Mumbai				\N	2026-03-12 10:56:27.559819	2026-03-12 10:56:27.55983
\.


--
-- Name: dock_allocation dock_allocation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocation
    ADD CONSTRAINT dock_allocation_pkey PRIMARY KEY (dock_allocation_id);


--
-- Name: dock_allocations dock_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocations
    ADD CONSTRAINT dock_allocations_pkey PRIMARY KEY (dock_allocation_id);


--
-- Name: docks docks_dock_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docks
    ADD CONSTRAINT docks_dock_code_key UNIQUE (dock_code);


--
-- Name: docks docks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docks
    ADD CONSTRAINT docks_pkey PRIMARY KEY (dock_id);


--
-- Name: gate_documents gate_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_documents
    ADD CONSTRAINT gate_documents_pkey PRIMARY KEY (id);


--
-- Name: gate_entries gate_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_entries
    ADD CONSTRAINT gate_entries_pkey PRIMARY KEY (gate_entry_id);


--
-- Name: gate_entry_photos gate_entry_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_entry_photos
    ADD CONSTRAINT gate_entry_photos_pkey PRIMARY KEY (id);


--
-- Name: gate_material_details gate_material_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_material_details
    ADD CONSTRAINT gate_material_details_pkey PRIMARY KEY (id);


--
-- Name: gate_vehicle_inspection gate_vehicle_inspection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_vehicle_inspection
    ADD CONSTRAINT gate_vehicle_inspection_pkey PRIMARY KEY (id);


--
-- Name: id_counters id_counters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.id_counters
    ADD CONSTRAINT id_counters_pkey PRIMARY KEY (entity, date);


--
-- Name: permissions permissions_permission_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permission_code_key UNIQUE (permission_code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permission_id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_code_key UNIQUE (role_code);


--
-- Name: security_gates security_gates_gate_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_gates
    ADD CONSTRAINT security_gates_gate_code_key UNIQUE (gate_code);


--
-- Name: security_gates security_gates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_gates
    ADD CONSTRAINT security_gates_pkey PRIMARY KEY (gate_id);


--
-- Name: unloading_details unloading_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unloading_details
    ADD CONSTRAINT unloading_details_pkey PRIMARY KEY (unloading_id);


--
-- Name: unloading_photos unloading_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unloading_photos
    ADD CONSTRAINT unloading_photos_pkey PRIMARY KEY (photo_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_role_id);


--
-- Name: user_warehouses user_warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_warehouses
    ADD CONSTRAINT user_warehouses_pkey PRIMARY KEY (user_id, warehouse_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (warehouse_id);


--
-- Name: warehouses warehouses_warehouse_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_warehouse_code_key UNIQUE (warehouse_code);


--
-- Name: dock_allocation dock_allocation_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocation
    ADD CONSTRAINT dock_allocation_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(user_id);


--
-- Name: dock_allocation dock_allocation_dock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocation
    ADD CONSTRAINT dock_allocation_dock_id_fkey FOREIGN KEY (dock_id) REFERENCES public.docks(dock_id);


--
-- Name: dock_allocation dock_allocation_gate_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocation
    ADD CONSTRAINT dock_allocation_gate_entry_id_fkey FOREIGN KEY (gate_entry_id) REFERENCES public.gate_entries(gate_entry_id);


--
-- Name: dock_allocations dock_allocations_allocated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocations
    ADD CONSTRAINT dock_allocations_allocated_by_fkey FOREIGN KEY (allocated_by) REFERENCES public.users(user_id);


--
-- Name: dock_allocations dock_allocations_dock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocations
    ADD CONSTRAINT dock_allocations_dock_id_fkey FOREIGN KEY (dock_id) REFERENCES public.docks(dock_id);


--
-- Name: dock_allocations dock_allocations_gate_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dock_allocations
    ADD CONSTRAINT dock_allocations_gate_entry_id_fkey FOREIGN KEY (gate_entry_id) REFERENCES public.gate_entries(gate_entry_id);


--
-- Name: docks docks_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docks
    ADD CONSTRAINT docks_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(warehouse_id);


--
-- Name: gate_entries gate_entries_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_entries
    ADD CONSTRAINT gate_entries_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(user_id);


--
-- Name: gate_entries gate_entries_gate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_entries
    ADD CONSTRAINT gate_entries_gate_id_fkey FOREIGN KEY (gate_id) REFERENCES public.security_gates(gate_id);


--
-- Name: gate_entries gate_entries_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_entries
    ADD CONSTRAINT gate_entries_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(user_id);


--
-- Name: gate_entries gate_entries_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_entries
    ADD CONSTRAINT gate_entries_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(warehouse_id);


--
-- Name: gate_vehicle_inspection gate_vehicle_inspection_inspected_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gate_vehicle_inspection
    ADD CONSTRAINT gate_vehicle_inspection_inspected_by_fkey FOREIGN KEY (inspected_by) REFERENCES public.users(user_id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(permission_id);


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- Name: security_gates security_gates_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_gates
    ADD CONSTRAINT security_gates_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(warehouse_id);


--
-- Name: unloading_details unloading_details_dock_allocation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unloading_details
    ADD CONSTRAINT unloading_details_dock_allocation_id_fkey FOREIGN KEY (dock_allocation_id) REFERENCES public.dock_allocation(dock_allocation_id);


--
-- Name: unloading_details unloading_details_gate_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unloading_details
    ADD CONSTRAINT unloading_details_gate_entry_id_fkey FOREIGN KEY (gate_entry_id) REFERENCES public.gate_entries(gate_entry_id);


--
-- Name: unloading_details unloading_details_unloaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unloading_details
    ADD CONSTRAINT unloading_details_unloaded_by_fkey FOREIGN KEY (unloaded_by) REFERENCES public.users(user_id);


--
-- Name: unloading_photos unloading_photos_unloading_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unloading_photos
    ADD CONSTRAINT unloading_photos_unloading_id_fkey FOREIGN KEY (unloading_id) REFERENCES public.unloading_details(unloading_id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_warehouses user_warehouses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_warehouses
    ADD CONSTRAINT user_warehouses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_warehouses user_warehouses_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_warehouses
    ADD CONSTRAINT user_warehouses_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(warehouse_id);


--
-- PostgreSQL database dump complete
--

\unrestrict 5KCdKHwuc3uLsu6okYZ7uNFTA01RpAcO9GuxV63FZRkhpgWDtrkkWGsYiuxdEaZ

