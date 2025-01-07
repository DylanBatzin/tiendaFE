import { environment } from '../environments/environment';

class UserService {
  baseUrl = environment.baseUrl;

  async loginUser(loginData) {
    try {
      const response = await fetch(`${this.baseUrl}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('Token no proporcionado');
        const response = await fetch(`${this.baseUrl}users/byEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ Email: email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la solicitud');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;
    }
}


async updateUser(uuid, userData) {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Token no proporcionado');

    const response = await fetch(`${this.baseUrl}users/${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        FullName: userData.FullName,
        Email: userData.Email,
        PhoneNumber: userData.PhoneNumber,
        PasswordHash: userData.PasswordHash,
        BirthDate: userData.BirthDate,
        Rol: userData.Rol
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

async getUserByUuid(uuid) {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Token no proporcionado');

    const response = await fetch(`${this.baseUrl}users/${uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}


async getUsers() {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Token no proporcionado');

    const response = await fetch(`${this.baseUrl}users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener usuarios');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

async createUser(userData) {
  try {


    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Token no proporcionado');

    const response = await fetch(`${this.baseUrl}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        FullName: userData.FullName,
        Email: userData.Email,
        PhoneNumber: userData.PhoneNumber,
        PasswordHash: userData.PasswordHash,
        BirthDate: userData.BirthDate,
        Rol: userData.Rol,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}



async deleteUser(uuid) {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Token no proporcionado');

    const response = await fetch(`${this.baseUrl}users/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

}

export const userService = new UserService();
