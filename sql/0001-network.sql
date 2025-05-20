CREATE TABLE
    networks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        network_type INTEGER NOT NULL,
        chain_id TEXT NOT NULL,
        symbol TEXT NOT NULL,
        decimals INTEGER NOT NULL,
        slip44 INTEGER NOT NULL,
        is_user_added BOOLEAN NOT NULL DEFAULT FALSE,
        icon TEXT,
        UNIQUE (network_type, chain_id)
    );

CREATE TABLE
    network_rpc (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        network_id INTEGER NOT NULL,
        rpc_url TEXT NOT NULL,
        selected BOOLEAN NOT NULL,
        is_user_added BOOLEAN NOT NULL DEFAULT FALSE,
        UNIQUE (network_id, rpc_url)
    );

CREATE TABLE
    network_explorer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        network_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        explorer_type INTEGER NOT NULL,
        selected BOOLEAN NOT NULL,
        is_user_added BOOLEAN NOT NULL DEFAULT FALSE,
        UNIQUE (network_id, name)
    );