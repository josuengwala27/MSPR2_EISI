import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class StatutLot(str, enum.Enum):
    conforme = "conforme"
    alerte = "alerte"
    perime = "perime"


class TypeAlerte(str, enum.Enum):
    conditions_non_ideales = "conditions_non_ideales"
    peremption = "peremption"


class Entrepot(Base):
    __tablename__ = "entrepots"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    nom: Mapped[str] = mapped_column(String(255), nullable=False)
    pays_code: Mapped[str] = mapped_column(String(8), nullable=False)

    lots: Mapped[list["Lot"]] = relationship(back_populates="entrepot")
    mesures: Mapped[list["Mesure"]] = relationship(back_populates="entrepot")


class Lot(Base):
    __tablename__ = "lots"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    pays: Mapped[str] = mapped_column(String(8), nullable=False)
    exploitation: Mapped[str] = mapped_column(String(64), nullable=False)
    entrepot_id: Mapped[str] = mapped_column(ForeignKey("entrepots.id"), nullable=False)
    date_stockage: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    statut: Mapped[StatutLot] = mapped_column(
        Enum(StatutLot, name="statut_lot", values_callable=lambda x: [e.value for e in x]),
        default=StatutLot.conforme,
        nullable=False,
    )

    entrepot: Mapped["Entrepot"] = relationship(back_populates="lots")
    alertes: Mapped[list["Alerte"]] = relationship(back_populates="lot")


class Mesure(Base):
    __tablename__ = "mesures"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    entrepot_id: Mapped[str] = mapped_column(ForeignKey("entrepots.id"), nullable=False)
    lot_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    humidite: Mapped[float] = mapped_column(Float, nullable=False)
    horodatage: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    device_id: Mapped[str | None] = mapped_column(String(64), nullable=True)

    entrepot: Mapped["Entrepot"] = relationship(back_populates="mesures")


class Alerte(Base):
    __tablename__ = "alertes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    type: Mapped[TypeAlerte] = mapped_column(
        Enum(TypeAlerte, name="type_alerte", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    lot_id: Mapped[str] = mapped_column(ForeignKey("lots.id"), nullable=False)
    pays: Mapped[str] = mapped_column(String(8), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    resolue: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    email_envoye: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    lot: Mapped["Lot"] = relationship(back_populates="alertes")
