import { HttpContextToken } from '@angular/common/http';

export const USE_ASSOCIATION_TOKEN =
    new HttpContextToken<boolean>(() => false);