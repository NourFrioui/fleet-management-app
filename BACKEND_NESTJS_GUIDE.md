# 🦅 Guide Backend NestJS + PostgreSQL - Fleet Management

## 📖 Introduction

Ce guide complet vous accompagne pour créer le backend avec **NestJS** et **PostgreSQL**.

**Avantages de cette stack :**

- ✅ TypeScript natif (cohérence avec le frontend)
- ✅ Architecture modulaire et scalable
- ✅ Décorateurs puissants pour la validation et l'authentification
- ✅ TypeORM pour la gestion de la base de données
- ✅ Documentation Swagger automatique
- ✅ Tests unitaires et E2E intégrés

---

## 🚀 Setup Initial du Projet

### 1. Installation de NestJS CLI

```bash
npm install -g @nestjs/cli
```

### 2. Création du Projet

```bash
nest new fleet-management-api
cd fleet-management-api
```

### 3. Installation des Dépendances

```bash
# TypeORM et PostgreSQL
npm install @nestjs/typeorm typeorm pg

# Configuration
npm install @nestjs/config

# Authentification
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# Validation
npm install class-validator class-transformer

# CRON jobs
npm install @nestjs/schedule

# Swagger (Documentation API)
npm install @nestjs/swagger swagger-ui-express

# Upload de fichiers
npm install @nestjs/platform-express multer
npm install -D @types/multer
```

---

## ⚙️ Configuration

### .env

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=fleet_management

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=3600
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRATION=604800

# App
PORT=8000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://fleet.votredomaine.tn

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_FOLDER=./uploads
```

### app.module.ts

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { VehiclesModule } from "./vehicles/vehicles.module";
import { DriversModule } from "./drivers/drivers.module";
import { MaintenanceModule } from "./maintenance/maintenance.module";
import { OilChangesModule } from "./oil-changes/oil-changes.module";
import { TechnicalInspectionsModule } from "./technical-inspections/technical-inspections.module";
import { InsurancesModule } from "./insurances/insurances.module";
import { FuelConsumptionsModule } from "./fuel-consumptions/fuel-consumptions.module";
import { TireChangesModule } from "./tire-changes/tire-changes.module";
import { WashingModule } from "./washing/washing.module";
import { AlertsModule } from "./alerts/alerts.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { CalendarModule } from "./calendar/calendar.module";
import { FilesModule } from "./files/files.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DATABASE_HOST"),
        port: config.get("DATABASE_PORT"),
        username: config.get("DATABASE_USERNAME"),
        password: config.get("DATABASE_PASSWORD"),
        database: config.get("DATABASE_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: config.get("NODE_ENV") === "development", // À désactiver en production
        logging: config.get("NODE_ENV") === "development",
      }),
    }),

    // CRON jobs
    ScheduleModule.forRoot(),

    // Modules
    AuthModule,
    UsersModule,
    VehiclesModule,
    DriversModule,
    MaintenanceModule,
    OilChangesModule,
    TechnicalInspectionsModule,
    InsurancesModule,
    FuelConsumptionsModule,
    TireChangesModule,
    WashingModule,
    AlertsModule,
    DashboardModule,
    CalendarModule,
    FilesModule,
  ],
})
export class AppModule {}
```

### main.ts

```typescript
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: configService.get("ALLOWED_ORIGINS")?.split(",") || [
      "http://localhost:5173",
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api/v1");

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, // Retourne une erreur si propriété non définie
      transform: true, // Transforme automatiquement les types
    })
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("Fleet Management API")
    .setDescription("API de gestion de flotte de véhicules")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = configService.get("PORT") || 8000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
```

---

## 🗄️ Entités TypeORM

### User Entity

```typescript
// src/users/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  DRIVER = "driver",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Ne pas exposer dans les réponses API
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.DRIVER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Vehicle Entity

```typescript
// src/vehicles/entities/vehicle.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Driver } from "../../drivers/entities/driver.entity";
import { Maintenance } from "../../maintenance/entities/maintenance.entity";

export enum VehicleType {
  CAR = "car",
  TRUCK = "truck",
  VAN = "van",
  MOTORCYCLE = "motorcycle",
  BUS = "bus",
  TRAILER = "trailer",
}

export enum VehicleStatus {
  ACTIVE = "active",
  MAINTENANCE = "maintenance",
  OUT_OF_SERVICE = "out_of_service",
}

export enum FuelType {
  GASOLINE = "gasoline",
  DIESEL = "diesel",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
}

@Entity("vehicles")
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 20 })
  plateNumber: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({
    type: "enum",
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({
    type: "enum",
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;

  @Column({ default: 0 })
  mileage: number;

  @Column({
    type: "enum",
    enum: FuelType,
  })
  fuelType: FuelType;

  @Column({ type: "date" })
  purchaseDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  purchasePrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  currentValue: number;

  @Column({ type: "date", nullable: true })
  insuranceExpiry: Date;

  @Column({ type: "date", nullable: true })
  technicalInspectionExpiry: Date;

  @ManyToOne(() => Driver, (driver) => driver.vehicles, { nullable: true })
  @JoinColumn({ name: "assignedDriverId" })
  assignedDriver: Driver;

  @Column({ nullable: true })
  assignedDriverId: string;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.vehicle)
  maintenances: Maintenance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Driver Entity

```typescript
// src/drivers/entities/driver.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Vehicle } from "../../vehicles/entities/vehicle.entity";

export enum DriverStatus {
  AVAILABLE = "available",
  ON_TRIP = "on_trip",
  ON_LEAVE = "on_leave",
  INACTIVE = "inactive",
}

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column({ type: "date" })
  licenseExpiry: Date;

  @Column({
    type: "enum",
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
  })
  status: DriverStatus;

  @Column({ type: "date" })
  hireDate: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.assignedDriver)
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔐 Authentification JWT

### Auth Module

```bash
nest g module auth
nest g controller auth
nest g service auth
```

### DTOs

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin@fleet.tn" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "admin123" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Auth Service

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email ou mot de passe incorrect",
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email ou mot de passe incorrect",
        },
      });
    }

    // Mettre à jour lastLogin
    await this.usersService.updateLastLogin(user.id);

    // Générer les tokens
    const payload = { userId: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRATION"),
    });

    // Ne pas retourner le mot de passe
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
        expiresIn: parseInt(this.configService.get("JWT_EXPIRATION")),
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      });

      const user = await this.usersService.findOne(payload.userId);

      if (!user) {
        throw new UnauthorizedException();
      }

      const newPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const newToken = this.jwtService.sign(newPayload);

      return {
        success: true,
        data: {
          token: newToken,
          expiresIn: parseInt(this.configService.get("JWT_EXPIRATION")),
        },
      };
    } catch (error) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: "TOKEN_INVALID",
          message: "Refresh token invalide",
        },
      });
    }
  }
}
```

### JWT Strategy

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Utilisateur invalide ou inactif",
        },
      });
    }

    return user;
  }
}
```

### JWT Guard

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
```

### Roles Guard

```typescript
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../users/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      "roles",
      context.getHandler()
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### Roles Decorator

```typescript
// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../users/entities/user.entity";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
```

### Auth Controller

```typescript
// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Connexion utilisateur" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Rafraîchir le token" })
  async refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Obtenir les informations de l'utilisateur connecté",
  })
  async getProfile(@Request() req) {
    const { password, ...user } = req.user;
    return {
      success: true,
      data: user,
    };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Déconnexion" })
  async logout() {
    return {
      success: true,
      message: "Déconnexion réussie",
    };
  }
}
```

### Auth Module Configuration

```typescript
// src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRATION"),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 🚗 Module Véhicules (Exemple Complet)

### DTOs

```typescript
// src/vehicles/dto/create-vehicle.dto.ts
import {
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  VehicleType,
  VehicleStatus,
  FuelType,
} from "../entities/vehicle.entity";

export class CreateVehicleDto {
  @ApiProperty({ example: "123 TUN 1234" })
  @IsString()
  plateNumber: string;

  @ApiProperty({ example: "Renault" })
  @IsString()
  brand: string;

  @ApiProperty({ example: "Kangoo" })
  @IsString()
  model: string;

  @ApiProperty({ example: 2022 })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ enum: VehicleType, example: VehicleType.VAN })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ enum: FuelType, example: FuelType.DIESEL })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ example: "2022-01-15" })
  @IsDateString()
  purchaseDate: Date;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  mileage?: number;

  @ApiProperty({
    enum: VehicleStatus,
    example: VehicleStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
```

```typescript
// src/vehicles/dto/update-vehicle.dto.ts
import { PartialType } from "@nestjs/swagger";
import { CreateVehicleDto } from "./create-vehicle.dto";

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
```

### Service

```typescript
// src/vehicles/vehicles.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Vehicle } from "./entities/vehicle.entity";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Vérifier si la plaque existe déjà
    const existing = await this.vehiclesRepository.findOne({
      where: { plateNumber: createVehicleDto.plateNumber },
    });

    if (existing) {
      throw new ConflictException({
        success: false,
        error: {
          code: "DUPLICATE_ENTRY",
          message: "Ce numéro de plaque existe déjà",
        },
      });
    }

    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    return this.vehiclesRepository.save(vehicle);
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, search, status, type } = query;

    const queryBuilder = this.vehiclesRepository
      .createQueryBuilder("vehicle")
      .leftJoinAndSelect("vehicle.assignedDriver", "driver");

    // Recherche
    if (search) {
      queryBuilder.where(
        "(vehicle.plateNumber ILIKE :search OR vehicle.brand ILIKE :search OR vehicle.model ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Filtres
    if (status) {
      queryBuilder.andWhere("vehicle.status = :status", { status });
    }

    if (type) {
      queryBuilder.andWhere("vehicle.type = :type", { type });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Tri
    queryBuilder.orderBy("vehicle.createdAt", "DESC");

    const [vehicles, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: vehicles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: ["assignedDriver"],
    });

    if (!vehicle) {
      throw new NotFoundException({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Véhicule non trouvé",
        },
      });
    }

    return vehicle;
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    Object.assign(vehicle, updateVehicleDto);

    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehiclesRepository.remove(vehicle);
  }
}
```

### Controller

```typescript
// src/vehicles/vehicles.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { VehiclesService } from "./vehicles.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@ApiTags("vehicles")
@Controller("vehicles")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Créer un nouveau véhicule" })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    const vehicle = await this.vehiclesService.create(createVehicleDto);
    return {
      success: true,
      data: vehicle,
    };
  }

  @Get()
  @ApiOperation({ summary: "Liste tous les véhicules" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "type", required: false, type: String })
  findAll(@Query() query: any) {
    return this.vehiclesService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Détails d'un véhicule" })
  async findOne(@Param("id") id: string) {
    const vehicle = await this.vehiclesService.findOne(id);
    return {
      success: true,
      data: vehicle,
    };
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Mettre à jour un véhicule" })
  async update(
    @Param("id") id: string,
    @Body() updateVehicleDto: UpdateVehicleDto
  ) {
    const vehicle = await this.vehiclesService.update(id, updateVehicleDto);
    return {
      success: true,
      data: vehicle,
    };
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Supprimer un véhicule" })
  async remove(@Param("id") id: string) {
    await this.vehiclesService.remove(id);
    return {
      success: true,
      message: "Véhicule supprimé avec succès",
    };
  }
}
```

---

## ⏰ CRON Job pour les Alertes

```typescript
// src/alerts/alerts.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan, Between } from "typeorm";
import { Alert } from "./entities/alert.entity";
import { TechnicalInspection } from "../technical-inspections/entities/technical-inspection.entity";
import { OilChange } from "../oil-changes/entities/oil-change.entity";
import { Insurance } from "../insurances/entities/insurance.entity";
import { Driver } from "../drivers/entities/driver.entity";

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
    @InjectRepository(TechnicalInspection)
    private inspectionsRepository: Repository<TechnicalInspection>,
    @InjectRepository(OilChange)
    private oilChangesRepository: Repository<OilChange>,
    @InjectRepository(Insurance)
    private insurancesRepository: Repository<Insurance>,
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>
  ) {}

  // Exécuter tous les jours à 8h du matin
  @Cron("0 8 * * *")
  async generateAlerts() {
    this.logger.log("🔔 Génération des alertes...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Supprimer les anciennes alertes non résolues
    await this.alertsRepository.delete({
      status: "pending",
      dueDate: LessThan(today),
    });

    // Générer les alertes
    await this.generateTechnicalInspectionAlerts(today);
    await this.generateOilChangeAlerts(today);
    await this.generateInsuranceAlerts(today);
    await this.generateLicenseExpiryAlerts(today);

    this.logger.log("✅ Alertes générées avec succès");
  }

  private async generateTechnicalInspectionAlerts(today: Date) {
    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);

    const inspections = await this.inspectionsRepository.find({
      where: {
        expiryDate: Between(today, in7Days),
      },
      relations: ["vehicle"],
    });

    for (const inspection of inspections) {
      const daysUntilExpiry = Math.ceil(
        (inspection.expiryDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry === 7 || daysUntilExpiry === 3) {
        // Vérifier si l'alerte n'existe pas déjà
        const existing = await this.alertsRepository.findOne({
          where: {
            type: "technical_inspection",
            relatedId: inspection.id,
            daysBefore: daysUntilExpiry,
          },
        });

        if (!existing) {
          await this.alertsRepository.save({
            type: "technical_inspection",
            title:
              daysUntilExpiry === 3
                ? "Visite Technique URGENTE"
                : "Visite Technique à Effectuer",
            message: `La visite technique du véhicule ${inspection.vehicle.plateNumber} expire dans ${daysUntilExpiry} jour(s)`,
            priority: daysUntilExpiry === 3 ? "high" : "medium",
            relatedId: inspection.id,
            relatedType: "technical_inspection",
            vehicleId: inspection.vehicleId,
            dueDate: inspection.expiryDate,
            alertDate: today,
            daysBefore: daysUntilExpiry,
            status: "pending",
          });
        }
      }
    }
  }

  // Méthodes similaires pour les autres types d'alertes...
}
```

---

## 📊 Dashboard Statistics

```typescript
// src/dashboard/dashboard.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle, VehicleStatus } from "../vehicles/entities/vehicle.entity";
import { Driver, DriverStatus } from "../drivers/entities/driver.entity";
import { Maintenance } from "../maintenance/entities/maintenance.entity";
import { FuelConsumption } from "../fuel-consumptions/entities/fuel-consumption.entity";
import { Alert } from "../alerts/entities/alert.entity";
import { Insurance } from "../insurances/entities/insurance.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
    @InjectRepository(Maintenance)
    private maintenanceRepository: Repository<Maintenance>,
    @InjectRepository(FuelConsumption)
    private fuelRepository: Repository<FuelConsumption>,
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
    @InjectRepository(Insurance)
    private insurancesRepository: Repository<Insurance>
  ) {}

  async getStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      outOfServiceVehicles,
      totalDrivers,
      availableDrivers,
      onTripDrivers,
      onLeaveDrivers,
      scheduledMaintenance,
      inProgressMaintenance,
      completedMaintenanceThisMonth,
      totalMaintenanceCostThisMonth,
      fuelConsumptionsThisMonth,
      totalAlerts,
      highAlerts,
      mediumAlerts,
      lowAlerts,
      activeInsurances,
      insurancesExpiringThisMonth,
    ] = await Promise.all([
      // Véhicules
      this.vehiclesRepository.count(),
      this.vehiclesRepository.count({
        where: { status: VehicleStatus.ACTIVE },
      }),
      this.vehiclesRepository.count({
        where: { status: VehicleStatus.MAINTENANCE },
      }),
      this.vehiclesRepository.count({
        where: { status: VehicleStatus.OUT_OF_SERVICE },
      }),

      // Chauffeurs
      this.driversRepository.count(),
      this.driversRepository.count({
        where: { status: DriverStatus.AVAILABLE },
      }),
      this.driversRepository.count({ where: { status: DriverStatus.ON_TRIP } }),
      this.driversRepository.count({
        where: { status: DriverStatus.ON_LEAVE },
      }),

      // Maintenance
      this.maintenanceRepository.count({ where: { status: "scheduled" } }),
      this.maintenanceRepository.count({ where: { status: "in_progress" } }),
      this.maintenanceRepository.count({
        where: {
          status: "completed",
          completedDate: Between(firstDayOfMonth, lastDayOfMonth),
        },
      }),
      this.maintenanceRepository
        .createQueryBuilder("maintenance")
        .select("SUM(maintenance.cost)", "total")
        .where("maintenance.status = :status", { status: "completed" })
        .andWhere("maintenance.completedDate BETWEEN :start AND :end", {
          start: firstDayOfMonth,
          end: lastDayOfMonth,
        })
        .getRawOne()
        .then((result) => parseFloat(result.total) || 0),

      // Carburant
      this.fuelRepository.find({
        where: {
          date: Between(firstDayOfMonth, lastDayOfMonth),
        },
      }),

      // Alertes
      this.alertsRepository.count({ where: { status: "pending" } }),
      this.alertsRepository.count({
        where: { status: "pending", priority: "high" },
      }),
      this.alertsRepository.count({
        where: { status: "pending", priority: "medium" },
      }),
      this.alertsRepository.count({
        where: { status: "pending", priority: "low" },
      }),

      // Assurances
      this.insurancesRepository.count({ where: { status: "active" } }),
      this.insurancesRepository.count({
        where: {
          status: "active",
          endDate: Between(firstDayOfMonth, lastDayOfMonth),
        },
      }),
    ]);

    // Calculs carburant
    const totalFuelCost = fuelConsumptionsThisMonth.reduce(
      (sum, fc) => sum + parseFloat(fc.cost.toString()),
      0
    );
    const totalFuelQuantity = fuelConsumptionsThisMonth.reduce(
      (sum, fc) => sum + parseFloat(fc.quantity.toString()),
      0
    );
    const averageCostPerLiter =
      totalFuelQuantity > 0 ? totalFuelCost / totalFuelQuantity : 0;

    return {
      success: true,
      data: {
        vehicles: {
          total: totalVehicles,
          active: activeVehicles,
          inMaintenance: maintenanceVehicles,
          outOfService: outOfServiceVehicles,
        },
        drivers: {
          total: totalDrivers,
          available: availableDrivers,
          onTrip: onTripDrivers,
          onLeave: onLeaveDrivers,
        },
        maintenance: {
          scheduled: scheduledMaintenance,
          inProgress: inProgressMaintenance,
          completedThisMonth: completedMaintenanceThisMonth,
          totalCostThisMonth: totalMaintenanceCostThisMonth,
        },
        fuel: {
          totalCostThisMonth: totalFuelCost,
          averageConsumption: 0, // À calculer selon vos besoins
          averageCostPerLiter: averageCostPerLiter,
        },
        alerts: {
          total: totalAlerts,
          high: highAlerts,
          medium: mediumAlerts,
          low: lowAlerts,
        },
        insurance: {
          totalActive: activeInsurances,
          expiringThisMonth: insurancesExpiringThisMonth,
          totalCostThisMonth: 0, // À calculer
        },
      },
    };
  }
}
```

---

## 🏃 Commandes Utiles

### Générer un Module Complet

```bash
# Générer module, controller, service
nest g resource drivers
# Choisir: REST API, Yes (CRUD)

# Ou séparément
nest g module drivers
nest g controller drivers
nest g service drivers
```

### Migrations TypeORM

```bash
# Générer une migration
npm run typeorm migration:generate -- -n CreateVehiclesTable

# Exécuter les migrations
npm run typeorm migration:run

# Annuler la dernière migration
npm run typeorm migration:revert
```

### Seeds

```typescript
// src/database/seeds/create-admin.seed.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "../../users/entities/user.entity";

@Injectable()
export class CreateAdminSeed {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async run() {
    const adminExists = await this.usersRepository.findOne({
      where: { email: "admin@fleet.tn" },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await this.usersRepository.save({
        name: "Administrateur",
        email: "admin@fleet.tn",
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      });

      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️  Admin user already exists");
    }
  }
}
```

### Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 📝 Checklist Complète

### ✅ Setup (Jour 1)

- [ ] Installer NestJS CLI
- [ ] Créer le projet
- [ ] Installer toutes les dépendances
- [ ] Configurer .env
- [ ] Configurer app.module.ts et main.ts
- [ ] Créer la base de données PostgreSQL

### ✅ Authentification (Jour 2)

- [ ] Créer User entity
- [ ] Créer Auth module
- [ ] Implémenter JWT strategy et guards
- [ ] Tester login, me, refresh, logout
- [ ] Créer le seed admin

### ✅ Modules Principaux (Jours 3-7)

- [ ] Vehicles (CRUD complet)
- [ ] Drivers (CRUD complet)
- [ ] Maintenance (CRUD complet)
- [ ] Oil Changes (CRUD complet)
- [ ] Technical Inspections (CRUD complet)
- [ ] Dashboard (statistiques)

### ✅ Modules Secondaires (Jours 8-12)

- [ ] Insurances
- [ ] Fuel Consumptions + Statistics
- [ ] Tire Changes
- [ ] Washing
- [ ] Alerts (CRON job)
- [ ] Calendar
- [ ] Files (upload)

### ✅ Tests & Documentation (Jour 13-14)

- [ ] Tests unitaires critiques
- [ ] Swagger documentation complète
- [ ] README backend
- [ ] Postman collection

### ✅ Déploiement (Jour 15)

- [ ] Configuration production
- [ ] Déploiement (Heroku/Railway/DigitalOcean)
- [ ] Base de données distante
- [ ] HTTPS
- [ ] Monitoring

---

## 🎯 Résumé

**Avec NestJS + PostgreSQL, vous avez :**

✅ **Architecture propre et scalable**
✅ **TypeScript natif** (cohérence avec le frontend)
✅ **TypeORM** pour la gestion de la DB
✅ **Validation automatique** avec class-validator
✅ **Swagger automatique** pour la documentation
✅ **Tests intégrés** (unitaires et E2E)
✅ **Guards et Decorators** pour la sécurité
✅ **CRON jobs** pour les alertes automatiques

**Temps estimé : 2-3 semaines** pour un MVP complet fonctionnel.

---

**Bon développement avec NestJS ! 🚀**

Pour plus d'informations, consultez :

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation TypeORM](https://typeorm.io/)
- API_DOCUMENTATION.md pour les spécifications complètes
