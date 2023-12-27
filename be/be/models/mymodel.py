from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    Date,
    DateTime,
    String,
    ForeignKey,
    Enum,
    Text,
    Float,
    Index
)
from sqlalchemy.orm import relationship

from .meta import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    avatar = Column(String(255), nullable=False)
    jatah_cuti = Column(Integer, nullable=False)
    nik = Column(BigInteger, nullable=False)
    nohp = Column(String(255), nullable=False)
    jk_pegawai = Column(String(255), nullable=False)
    tgl_lahir = Column(Date, nullable=False)
    status = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum('admin', 'user'), nullable=False)
    total_work_id = Column(Integer, ForeignKey('work.id'), nullable=False)
    jabatan_id = Column(Integer, ForeignKey('position.id'), nullable=False)
    tokens = relationship('Token', back_populates='user',
                          cascade='all, delete-orphan')
    presences = relationship('Presence', backref='user')
    salarys = relationship('Salary', back_populates='user')
    leaves = relationship('Leave', back_populates='user')
    jabatan = relationship('Position', backref='users')
    work = relationship('Work', back_populates='user')


class Token(Base):
    __tablename__ = 'tokens'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    jwt_token = Column(Text, nullable=False)
    user = relationship('User', back_populates='tokens')


class Presence(Base):
    __tablename__ = 'presence'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    presence_in = Column(DateTime, nullable=False)
    presence_out = Column(DateTime, nullable=False)
    status = Column(Enum('diproses', 'ditolak',
                    'diterima', 'telat'), nullable=False)


class Salary(Base):
    __tablename__ = 'salary'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    total_presence = Column(Integer, nullable=False)
    total_work_id = Column(Integer, ForeignKey('work.id'), nullable=False)
    position_id = Column(Integer, ForeignKey('position.id'), nullable=False)
    total_salary = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    status = Column(Enum('diambil', 'belum diambil'), nullable=False)
    user = relationship('User', back_populates='salarys')
    work = relationship('Work', back_populates='salarys')
    position = relationship('Position', back_populates='salarys')


class Leave(Base):
    __tablename__ = 'leave'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    awal = Column(DateTime, nullable=False)
    akhir = Column(DateTime, nullable=False)
    status = Column(Enum('diproses', 'ditolak', 'diterima'), nullable=False)
    desc = Column(Text)
    user = relationship('User', back_populates='leaves')


class Position(Base):
    __tablename__ = 'position'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    salary_in_months = Column(Float, nullable=False)
    salarys = relationship('Salary', back_populates='position')


class Work(Base):
    __tablename__ = 'work'
    id = Column(Integer, primary_key=True)
    total_days = Column(Integer, nullable=False)
    salarys = relationship('Salary', back_populates='work')
    user = relationship('User', back_populates='work')


class MyModel(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    value = Column(Integer)


Index('my_index', MyModel.name, unique=True, mysql_length=255)
