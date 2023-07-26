# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals


# -*- coding: utf-8 -*-
ADMIN = 1
EMPLOYEE = 2
MAMANGER = 3
ACCOUNTANT = 4
ROLE_CHOICES = (
    (ADMIN, "Admin"),
    (EMPLOYEE, "Nhân viên"),
    (MAMANGER, "Quản lý"),
    (ACCOUNTANT, "Kế toán"),
)

Y_M_D_FORMAT = "%Y-%m-%d"
Y_M_D_H_M_FORMAT = "%Y-%m-%d %H:%M"

PARSE_ERROR_MSG = "Parser error"
