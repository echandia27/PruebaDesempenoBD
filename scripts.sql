create schema if not exists juan_echandia;

create extension if not exists pgcrypto;

-- tabla clientes
create table if not exists juan_echandia.clientes (
    id uuid default gen_random_uuid(),
    nombre varchar(150) not null,
    email varchar(150) not null,
    telefono varchar(50),

    constraint pk_clientes primary key (id),
    constraint uq_clientes_email unique (email)
);

--tabla direcciones

create table if not exists juan_echandia.direcciones (
    id uuid default gen_random_uuid(),
    cliente_id uuid not null,
    direccion_texto varchar(255) not null,

    constraint pk_direcciones primary key (id),
    constraint fk_direcciones_cliente foreign key (cliente_id)
        references juan_echandia.clientes(id)
        on delete cascade,
    constraint uq_cliente_direccion unique (cliente_id, direccion_texto)
);

--tabla proveedores

create table if not exists juan_echandia.proveedores (
    id uuid default gen_random_uuid(),
    nombre varchar(150) not null,
    email varchar(150) not null,

    constraint pk_proveedores primary key (id),
    constraint uq_proveedores_email unique (email)
);

--tabla categorias

create table if not exists juan_echandia.categorias (
    id uuid default gen_random_uuid(),
    nombre varchar(120) not null,

    constraint pk_categorias primary key (id),
    constraint uq_categorias_nombre unique (nombre)
);

--tabla productos

create table if not exists juan_echandia.productos (
    id uuid default gen_random_uuid(),
    sku varchar(100) not null,
    nombre varchar(200) not null,
    categoria_id uuid not null,
    proveedor_id uuid not null,

    constraint pk_productos primary key (id),
    constraint uq_productos_sku unique (sku),
    constraint fk_productos_categoria foreign key (categoria_id)
        references juan_echandia.categorias(id),
    constraint fk_productos_proveedor foreign key (proveedor_id)
        references juan_echandia.proveedores(id)
);

--tabla transacciones

create table if not exists juan_echandia.transacciones (
    id uuid default gen_random_uuid(),
    codigo_transaccion varchar(100) not null,
    fecha date not null,
    cliente_id uuid not null,

    constraint pk_transacciones primary key (id),
    constraint uq_transacciones_codigo unique (codigo_transaccion),
    constraint fk_transacciones_cliente foreign key (cliente_id)
        references juan_echandia.clientes(id)
);

-- tabla detalle_transaccion

create table if not exists juan_echandia.detalle_transaccion (
    id uuid default gen_random_uuid(),
    transaccion_id uuid not null,
    producto_id uuid not null,
    precio_unitario numeric(12,2) not null,
    cantidad integer not null,
    total_linea numeric(14,2) not null,

    constraint pk_detalle_transaccion primary key (id),

    constraint fk_detalle_transaccion_transaccion foreign key (transaccion_id)
        references juan_echandia.transacciones(id)
        on delete cascade,

    constraint fk_detalle_transaccion_producto foreign key (producto_id)
        references juan_echandia.productos(id),

    constraint uq_detalle_transaccion unique (transaccion_id, producto_id),

    constraint chk_precio_unitario check (precio_unitario >= 0),
    constraint chk_cantidad check (cantidad > 0),
    constraint chk_total_linea check (total_linea >= 0)
);

--indices para consultas BI

create index if not exists idx_transacciones_cliente
    on juan_echandia.transacciones(cliente_id);

create index if not exists idx_transacciones_fecha
    on juan_echandia.transacciones(fecha);

create index if not exists idx_productos_categoria
    on juan_echandia.productos(categoria_id);

create index if not exists idx_productos_proveedor
    on juan_echandia.productos(proveedor_id);

create index if not exists idx_detalle_transaccion_transaccion
    on juan_echandia.detalle_transaccion(transaccion_id);

create index if not exists idx_detalle_transaccion_producto
    on juan_echandia.detalle_transaccion(producto_id);

---------- organizar el no haber usado cascade
alter table juan_echandia.detalle_transaccion
drop constraint fk_detalle_transaccion_producto;


alter table juan_echandia.detalle_transaccion
add constraint fk_detalle_transaccion_producto
foreign key (producto_id)
references juan_echandia.productos(id)
on delete cascade;

alter table juan_echandia.productos
drop constraint fk_productos_categoria;


alter table juan_echandia.productos
drop constraint fk_productos_proveedor;



alter table juan_echandia.productos
add constraint fk_productos_categoria
foreign key (categoria_id)
references juan_echandia.categorias(id)
on delete cascade;




alter table juan_echandia.productos
add constraint fk_productos_proveedor
foreign key (proveedor_id)
references juan_echandia.proveedores(id)
on delete cascade;