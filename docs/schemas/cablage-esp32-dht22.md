# Cablage ESP32 + DHT22 — FutureKawa Colombie

> Export PNG pour soutenance : [mermaid.live](https://mermaid.live) ou capture d'ecran.

## Schema

```text
         ESP32                         DHT22
    +----------------+              +-----------+
    |            3.3V|--------------|VCC        |
    |             GND|--------------|GND        |
    |     GPIO 23 (D23)|------------|DATA       |
    +----------------+              +-----------+
                      \
                       `-- pull-up 10 kOhm vers 3.3V (si non integre au module)
```

## Brochage confirme equipe

| DHT22 | ESP32 |
|-------|-------|
| VCC | 3.3V |
| GND | GND |
| DATA | **GPIO 23 (D23)** |

Reference : `config/iot.yaml`

## Precautions

- Ne pas alimenter le DATA en 5 V si le module est 3.3 V logique.
- Respecter **2 s minimum** entre deux lectures DHT22.
- Cable DATA court si possible (bruit).

## Topic MQTT

`futurekawa/co/ent-co-bogota-01/mesures`
