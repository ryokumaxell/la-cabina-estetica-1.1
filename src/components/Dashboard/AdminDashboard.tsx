import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Divider } from 'antd';
import { UserOutlined, TeamOutlined, MedicineBoxOutlined, BookOutlined } from '@ant-design/icons';
import { mockUsuarios } from '../../data/mockData';
import { Usuario } from '../../types';

// Definir tipos para las estadísticas
interface UserStats {
  total: number;
  cosmetologas: number;
  dermatologos: number;
  estudiantes: number;
  otros: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    cosmetologas: 0,
    dermatologos: 0,
    estudiantes: 0,
    otros: 0
  });
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      try {
        // En un caso real, aquí se cargarían los usuarios desde Firebase
        const users = mockUsuarios;
        
        // Calcular estadísticas
        const statistics: UserStats = {
          total: users.length,
          cosmetologas: users.filter(u => u.rol === 'cosmetologa').length,
          dermatologos: users.filter(u => u.rol === 'dermatologo').length,
          estudiantes: users.filter(u => u.rol === 'estudiante').length,
          otros: users.filter(u => !['cosmetologa', 'dermatologo', 'estudiante'].includes(u.rol || '')).length
        };
        
        setStats(statistics);
        setUsuarios(users);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Columnas para la tabla de usuarios
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol: string) => {
        let color = 'blue';
        if (rol === 'cosmetologa') color = 'green';
        if (rol === 'dermatologo') color = 'purple';
        if (rol === 'estudiante') color = 'orange';
        
        return (
          <Tag color={color}>
            {rol?.toUpperCase() || 'N/A'}
          </Tag>
        );
      }
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo: boolean) => (
        <Tag color={activo ? 'success' : 'error'}>
          {activo ? 'ACTIVO' : 'INACTIVO'}
        </Tag>
      )
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-frodyta-primary mb-8">Dashboard Administrativo</h1>
        <p className="text-gray-600">Bienvenido al panel de administración de usuarios</p>
      </div>
      
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-md">
            <Statistic
              title="Total Usuarios"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-md">
            <Statistic
              title="Cosmetólogas"
              value={stats.cosmetologas}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-md">
            <Statistic
              title="Dermatólogos"
              value={stats.dermatologos}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-md">
            <Statistic
              title="Estudiantes"
              value={stats.estudiantes}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Listado de Usuarios</Divider>
      
      <Table 
        dataSource={usuarios} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="shadow-md"
      />
    </div>
  );
}